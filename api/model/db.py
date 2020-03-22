from firebase_admin import firestore
# noinspection PyPackageRequirements
from google.cloud import firestore_v1

from .records import Record
from .registrations import Registration


def firestore_client():
    return firestore.client()


def registrations_coll():
    return firestore_client().collection('registrations')


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class RecordsDb:

    def get(self, user):
        """Get medical record documents from the Firestore database.

        :param user: username for whom the records shall be retrieved
        :return: all records for the user, empty if nothing found
        """
        records_ref: firestore_v1.collection.CollectionReference = firestore_client().collection(
            'users/' + user + '/records')
        return [record.get().to_dict() for record in records_ref.list_documents(page_size=50)]

    @staticmethod
    def create_record(username, date, record: Record) -> firestore_v1.document.DocumentReference:
        """Create medical record from the json file from the record input

        :return: DocumentReference of the new document created.
        """
        records_ref: firestore_v1.collection.CollectionReference = firestore_client().collection(
            'users/' + username + '/records')
        timestamp, doc_ref = records_ref.add(record.to_json(), date)
        return doc_ref


class AnamnesesDb:

    def get(self, user):
        """Get anamnese single record from the Firestore database.

        :param user: username for whom the anamnese shall be retrieved
        :return: anamnese data record for the user, empty if nothing found
        """
        anamnese_ref = firestore_v1.collection.CollectionReference = firestore_client().collection(
            'users/' + user + '/anamneses').document(u'data')
        anamnese = anamnese_ref.get().to_dict()
        return anamnese

    @staticmethod
    def create(user, anamnese: Anamnese):
        """Create single anamnese record from the json file from the input
        """
        anamnese_ref = firestore_client().collection(
            'users/' + user + '/anamneses').document(u'data')
        # doc_ref = anamnese_ref.document(u'data').add(anamnese.to_json())
        doc_ref = anamnese_ref.set(anamnese.to_json())
        return doc_ref


class RegistrationDb:

    @staticmethod
    def create(registration: Registration):
        """Create a registration document on the Firestore database.

        :param registration: Registration object instance
        :return: DocumentReference of the new document created.
        """
        doc_ref: firestore_v1.document.DocumentReference
        timestamp, doc_ref = registrations_coll().add(registration.to_json())
        return doc_ref
