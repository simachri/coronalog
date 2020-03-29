from typing import Dict, List, Any

from firebase_admin import firestore
# noinspection PyPackageRequirements
from google.api_core.exceptions import AlreadyExists
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.collection import CollectionReference
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.document import DocumentReference

from api import Record, Anamnesis, Symptoms, User


def firestore_client():
    return firestore.client()


def registrations_coll():
    return firestore_client().collection('registrations')


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


def get_doc_attr(doc_ref: DocumentReference) -> Dict[Any, Any]:
    """Returns all the attributes of a DocumentReference. The current data is fetched.

    :return: Empty dictionary, if the document does not exist.
    """
    doc_snapshot = doc_ref.get()
    if not doc_snapshot.exists:
        return {}
    doc_attr = doc_snapshot.to_dict()
    # The document ID is not returned by to_dict above. We need to add it manually.
    doc_attr.update(id=doc_snapshot.id)
    return doc_attr


class UsersDb:

    @staticmethod
    def set_user(user: User) -> User:
        """Create or update user for whom records can be tracked.

        If the user already exists, nothing is changed.
        :return: The user data.
        """
        # As a document is only written to the database when it has some content when using the .document() API,
        # we need to use the .add() API instead to be able to create empty user documents.
        try:
            timestamp, doc_ref = firestore_client().collection(u'users').add(user.anamnesis.dict(), document_id=user.username)
        except AlreadyExists:
            # The user already exists, which is fine for us.
            doc_ref = firestore_client().collection(u'users').document(user.username)
        user_from_db = User(username=user.username)
        user_from_db.anamnesis = Anamnesis.parse_obj(doc_ref.get().to_dict())
        return user_from_db

    @staticmethod
    def delete_user(username):
        """Delete a user record."""
        firestore_client().collection(u'users').document(username).delete()

    @staticmethod
    def get_all() -> List[User]:
        """
        :return: All user records in the database.
        """
        users_ref: CollectionReference = firestore_client().collection('users')
        users = []
        for user_ref in users_ref.list_documents():
            user_snapshot = user_ref.get()
            user = User(username=user_snapshot.id, anamnesis=Anamnesis.parse_obj(user_snapshot.to_dict()))
            users.append(user)
        return users

    @staticmethod
    def get(username: str) -> User:
        """
        :return: The user record for the requested user.
        :raises: LookupError: If no database document exists for the requested user.
        """
        user_ref: DocumentReference = firestore_client().collection('users').document(username)
        user_snapshot = user_ref.get()
        if not user_snapshot.exists:
            raise LookupError(f"No database document exists for user '{username}'.")
        return User(username=user_snapshot.id, anamnesis=Anamnesis.parse_obj(user_snapshot.to_dict()))


class RecordsDb:

    @staticmethod
    def get(username) -> List[Record]:
        """Get medical record documents from the Firestore database.

        :param username: username for whom the records shall be retrieved
        :return: all records for the user, empty if nothing found
        """
        records_ref: CollectionReference = firestore_client().collection(
            'users/' + username + '/records')
        records = []
        for doc_ref in records_ref.list_documents(page_size=50):
            doc_snapshot = doc_ref.get()
            symptoms = Symptoms.parse_obj(doc_snapshot.to_dict())
            record = Record(username=username, date=doc_snapshot.id, symptoms=symptoms)
            records.append(record)
        return records

    # @staticmethod
    # def set_record(username, date, record: Record) -> Dict[Any, Any]:
    #     """Set medical record from the json file from the record input
    #
    #     If the record already exists, its data is merged.
    #     :return: DocumentReference of the new document created.
    #     """
    #     record_ref: DocumentReference = firestore_client().collection(
    #         'users/' + username + '/records').document(date)
    #     record_ref.set(record.to_json(), merge=True)
    #     return get_doc_attr(record_ref)
    #


class AnamnesesDb:

    @staticmethod
    def get(user) -> Dict[Any, Any]:
        """Get anamnese single record from the Firestore database.

        :param user: username for whom the anamnese shall be retrieved
        :return: anamnese data record for the user, empty if nothing found
        """
        anamnese_ref: DocumentReference = firestore_client().collection('users').document(user)
        anamnese = anamnese_ref.get().to_dict()
        return anamnese

    @staticmethod
    def set_anamnesis(anamnesis: Anamnesis) -> Anamnesis:
        """Create or update single anamnesis record from the json file from the input.
        If the record already exists, a merge is performed.

        :return: DocumentReference of the new document created.
        """
        db_record_ref: DocumentReference = firestore_client().collection('users').document(anamnesis.username)
        db_record_ref.set(anamnesis.dict(), merge=True)
        doc_snapshot = db_record_ref.get()
        if not doc_snapshot.exists:
            raise LookupError(f"No database document exists for user '{anamnesis.username}'.")
        doc_attr = doc_snapshot.to_dict()
        # The document ID is not returned by to_dict above. We need to add it manually.
        doc_attr.update(id=doc_snapshot.id)
        return anamnesis.parse_obj(doc_attr)
