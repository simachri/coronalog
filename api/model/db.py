import datetime
from typing import List, Tuple, Sequence

from firebase_admin import firestore
# noinspection PyPackageRequirements
from google.cloud.firestore_v1 import Client, WriteBatch
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.collection import CollectionReference
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.document import DocumentReference, DocumentSnapshot
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.transforms import Sentinel
from google.cloud.firestore_v1.query import Query

from models import Record, Anamnesis, Symptoms, User, UserStored, UsagePurpose
from errors import *


def firestore_client() -> Client:
    return firestore.client()


def get_timestamp() -> Sentinel:
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


def convert_date_to_str(date: datetime.date) -> str:
    return date.strftime('%Y-%m-%d')


def delete_doc(batch: WriteBatch, doc: DocumentReference):
    """Delete the given document with reference to a WriteBatch.

    Does NOT perform a commit.
    """
    batch.delete(doc)


def delete_subcolls(batch: WriteBatch, doc: DocumentReference):
    """Delete documents within all subcollections of the provided document."""
    colls: Sequence[CollectionReference] = doc.collections()
    for coll in colls:
        for subcoll_doc_ref in coll.list_documents():
            delete_subcolls(batch, subcoll_doc_ref)
        # The break is required such that the 'else' block below is executed if colls is empty.
        break
    else:
        # No collections within the provided document
        delete_doc(batch, doc)


class UsersDb:

    @staticmethod
    def username_exists(username: str) -> Tuple[bool, DocumentReference]:
        """Query the db to check if user with username exists"""
        query = firestore_client().collection(u'users').where(u'username', u'==', username)
        doc = query.stream()
        try:
            snap = next(doc)
            return True, snap.reference
        except:
            return False, None

    @staticmethod
    def user_id_exists(user_id: str) -> Tuple[bool, DocumentReference]:
        """Query the db to check if user with specified id exists.

        :return: true or false depending on the existence of the user and the DocumentReference if it exists.
        """
        doc_ref = firestore_client().document(u'users', user_id)
        if doc_ref.get().exists:
            return True, doc_ref
        else:
            return False, None 

    @staticmethod
    def save_new_user(user_id: str, user: UserStored) -> None:
        """Create a user in the db and raise an error if user already exists"""
        exists, _ = UsersDb.username_exists(user.username)
        if exists:
            raise UserAlreadyExistsException(f'This username already exists: {user.username}')
        firestore_client().collection(u'users').add(
            document_data=user.dict(),
            document_id=user_id
        )

    @staticmethod
    def get_user(username: str) -> Tuple[str, UserStored]:
        """Get the user record by username.

        :return: The user record for the requested user and his id.
        :raises LookupError: If no database document exists for the requested user.
        """
        user_exists, doc_ref = UsersDb.username_exists(username)
        if not user_exists:
            raise LookupError(f"No database document exists for user {username}.")
        return doc_ref.get().id, UserStored(**doc_ref.get().to_dict())

    @staticmethod
    def get_user_by_id(user_id: str) -> UserStored:
        """Get the user record by id

        :return: The user record of the specified id.
        :raises LookupError: If no user with this id exists.
        """
        user_exists, doc_ref = UsersDb.user_id_exists(user_id)
        if not user_exists:
            raise LookupError(f'User with id {user_id} does not exist.')
        return UserStored(**doc_ref.get().to_dict())

    @staticmethod
    def remove_user_by_id(user_id: str) -> None:
        """Permanently remove the user with specified is from the db."""
        batch: WriteBatch = firestore_client().batch()
        user_doc: DocumentReference = firestore_client().collection(u'users').document(user_id)
        delete_subcolls(batch, user_doc)
        batch.commit()
        user_doc.delete()

    @staticmethod
    def remove_user_by_username(username: str):
        """Delete a user record including all its documents of its subcollections.

        When a document in Firestore is deleted, the documents of its subcollections are not deleted,
        see https://firebase.google.com/docs/firestore/solutions/delete-collections
        """
        snaps = firestore_client().collection(u'users').where(u'username', u'==', username).stream()
        try:
            snap = next(snaps)
            UsersDb.remove_user_by_id(snap.id)
        except:
            print('username does not exist')

    @staticmethod
    def update_user(user_id: str, anamnesis: Anamnesis = None) -> Anamnesis:
        """Create or update user for whom records can be tracked."""
        if anamnesis is None:
            new_anamnesis_data = {}
        else:
            # We do not want default values to overwrite existing values so we only fetch the values
            # that have been explicitely set for the model.
            new_anamnesis_data = anamnesis.dict(exclude_unset=True)
        doc_ref: DocumentReference = firestore_client().collection(u'users').document(user_id)
        old_anamnesis = doc_ref.get().get(u'anamnesis')
        doc_ref.set(
            document_data={'anamnesis': {**old_anamnesis, **new_anamnesis_data}},
            merge=True
        )
        return Anamnesis.parse_obj(doc_ref.get().get(u'anamnesis'))

    @staticmethod
    def get_all() -> List[User]:
        """
        :return: All user records in the database.
        """
        users_ref: CollectionReference = firestore_client().collection('users')
        users = []
        for user_ref in users_ref.list_documents():
            user_snapshot = user_ref.get()
            user = User(username=user_snapshot.get(u'username'), anamnesis=Anamnesis.parse_obj(user_snapshot.to_dict()['anamnesis']))
            users.append(user)
        return users


class RecordsDb:

    @staticmethod
    def get(username) -> List[Record]:
        """Get medical record documents from the Firestore database.

        :param username: username for whom the records shall be retrieved
        :return: all records for the user, empty if nothing found
        """
        # TODO: Raise exception if user record does not exist.
        records_ref: CollectionReference = firestore_client().collection(
                'users/' + username + '/records')
        records = []
        for doc_ref in records_ref.list_documents(page_size=50):
            doc_snapshot = doc_ref.get()
            symptoms = Symptoms.parse_obj(doc_snapshot.to_dict())
            record = Record(username=username, date=doc_snapshot.id, symptoms=symptoms)
            records.append(record)
        return records

    @staticmethod
    def set_record(user: User, record: Record) -> Record:
        """Set medical record data.
        If the record already exists, its data is merged.

        :return: The updated record data.
        :raises LookupError: If no record exists for the requested user.
        """
        user_exists, user_ref = UsersDb.exists(user.username)
        if not user_exists:
            raise LookupError(f"No database document exists for user '{user.username}'.")
        date_str = convert_date_to_str(record.date)
        record_ref: DocumentReference = firestore_client().collection('users/' + user.username + '/records').document(
                date_str)
        # We do not want default values to overwrite existing values so we only fetch the values
        # that have been explicitely set for the model.
        record_ref.set(record.symptoms.dict(exclude_unset=True), merge=True)
        db_data = record_ref.get().to_dict()
        return Record(date=date_str, symptoms=Symptoms.parse_obj(db_data))


class AnamnesesDb:

    @staticmethod
    def get(username: str) -> Anamnesis:
        """Get anamnese single record from the Firestore database.

        :return: Anamnesis data record for the user.
        :raises: LookupError if no record exists for the requested user.
        """
        user_ref: DocumentReference = firestore_client().collection('users').document(username)
        snap = user_ref.get()
        if not snap.exists:
            raise LookupError(f"No database document exists for user '{username}'.")
        return Anamnesis(user=User(username=username), **snap.to_dict())

    @staticmethod
    def set_anamnesis(username: str, anamnesis: Anamnesis) -> Anamnesis:
        """Create or update single anamnesis record from the json file from the input.
        If the record already exists, a merge is performed.
        If the user does not exist, it is created.

        :return: DocumentReference of the new document created.
        """
        user_ref: DocumentReference = firestore_client().collection('users').document(username)
        # We do not want default values to overwrite existing values so we only fetch the values
        # that have been explicitely set for the model.
        user_ref.set(anamnesis.dict(exclude_unset=True), merge=True)
        return Anamnesis.parse_obj(user_ref.get().to_dict())

class UsagePurposesDb:

    @staticmethod
    def get_all() -> Sequence[DocumentReference]:
        """ Get all registered usage purposes from db"""
        return firestore_client().collection(u'usage_purpose').list_documents()