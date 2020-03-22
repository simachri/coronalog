from typing import Dict, List, Any

from firebase_admin import firestore
from firebase_admin.exceptions import ConflictError
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.collection import CollectionReference
# noinspection PyPackageRequirements
from google.cloud.firestore_v1.document import DocumentReference

from .anamneses import Anamnese
from .records import Record
from .registrations import Registration


def firestore_client():
    return firestore.client()


def registrations_coll():
    return firestore_client().collection('registrations')


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


def get_doc_attr(doc_ref: DocumentReference) -> Dict[Any, Any]:
    """Returns all the attributes of a DocumentReference. The current data is fetched."""
    doc_snapshot = doc_ref.get()
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
        except ConflictError:
            # The user already exists, which is fine for us.
            doc_ref = firestore_client().collection(u'users').document(username)
        return get_doc_attr(doc_ref)

    @staticmethod
    def delete_user(username):
        """Delete a user record."""
        firestore_client().collection(u'users').document(username).delete()


class RecordsDb:

    @staticmethod
    def get(user) -> List[Dict[Any, Any]]:
        """Get medical record documents from the Firestore database.

        :param user: username for whom the records shall be retrieved
        :return: all records for the user, empty if nothing found
        """
        records_ref: CollectionReference = firestore_client().collection(
            'users/' + user + '/records')
        return [record.get().to_dict() for record in records_ref.list_documents(page_size=50)]

    @staticmethod
    def set_record(username, date, record: Record) -> Dict[Any, Any]:
        """Set medical record from the json file from the record input

        If the record already exists, its data is updated.
        :return: DocumentReference of the new document created.
        """
        record_ref: DocumentReference = firestore_client().collection(
            'users/' + username + '/records').document(date)
        record_ref.set(record.to_json())
        return get_doc_attr(record_ref)


class AnamnesesDb:

    @staticmethod
    def get(user) -> Dict[Any, Any]:
        """Get anamnese single record from the Firestore database.

        :param user: username for whom the anamnese shall be retrieved
        :return: anamnese data record for the user, empty if nothing found
        """
        anamnese_ref: DocumentReference = firestore_client().collection('users/' + user + '/anamneses').document(
            u'data')
        anamnese = anamnese_ref.get().to_dict()
        return anamnese

    @staticmethod
    def set_anamnesis(username, anamnese: Anamnese) -> Dict[Any, Any]:
        """Create single anamnesis record from the json file from the input

        If the record already exists, nothing is changed.
        :return: DocumentReference of the new document created.
        """
        anamnesis_ref: DocumentReference = firestore_client().collection('users/' + username).document(u'anamnesis')
        anamnesis_ref.set(anamnese.to_json())
        return get_doc_attr(anamnesis_ref)


class RegistrationDb:

    @staticmethod
    def create(registration: Registration):
        """Create a registration document on the Firestore database.

        :param registration: Registration object instance
        :return: DocumentReference of the new document created.
        """
        doc_ref: DocumentReference
        timestamp, doc_ref = registrations_coll().add(registration.to_json())
        return doc_ref
