from typing import Dict, List, Any

from firebase_admin import firestore
# noinspection PyPackageRequirements
from google.api_core.exceptions import AlreadyExists
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.collection import CollectionReference
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.document import DocumentReference

from api import Record, Anamnesis, Symptoms


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
    def set_user(username) -> Dict[Any, Any]:
        """Create or update user for whom records can be tracked.

        If the user already exists, nothing is changed.
        :return: The document data
        """
        # As a document is only written to the database when it has some content when using the .document() API,
        # we need to use the .add() API instead to be able to create empty user documents.
        try:
            timestamp, doc_ref = firestore_client().collection(u'users').add({}, document_id=username)
        except AlreadyExists:
            # The user already exists, which is fine for us.
            doc_ref = firestore_client().collection(u'users').document(username)
        return get_doc_attr(doc_ref)

    @staticmethod
    def delete_user(username):
        """Delete a user record."""
        firestore_client().collection(u'users').document(username).delete()

    @staticmethod
    def get_all_users():
        """
        :return: all users that exists in the firestore database
        """
        users_ref: CollectionReference = firestore_client().collection('users')
        users = []
        for user_ref in users_ref.list_documents():
            user_snapshot = user_ref.get()
            users.append(user_snapshot.to_dict())
        return users

    @staticmethod
    def check_if_user_exists(user):
        users_ref: CollectionReference = firestore_client().collection('users')
        user_ref: DocumentReference = users_ref.document(user)
        return user_ref.get().exists


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

    @staticmethod
    def set_record(username, date, record: Record) -> Dict[Any, Any]:
        """Set medical record from the json file from the record input

        If the record already exists, its data is merged.
        :return: DocumentReference of the new document created.
        """
        record_ref: DocumentReference = firestore_client().collection(
            'users/' + username + '/records').document(date)
        record_ref.set(record.to_json(), merge=True)
        return get_doc_attr(record_ref)


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
            raise LookupError(f"No database document exists for user {anamnesis.username}.")
        doc_attr = doc_snapshot.to_dict()
        # The document ID is not returned by to_dict above. We need to add it manually.
        doc_attr.update(id=doc_snapshot.id)
        return anamnesis.parse_obj(doc_attr)
