from firebase_admin import firestore, initialize_app
from .registrations import Registration
# noinspection PyPackageRequirements
from google.cloud import firestore_v1

# Initialize Firestore DB
firebase_app = initialize_app()
firestore_client: firestore_v1.client.Client = firestore.client()
registrations_coll: firestore_v1.collection.CollectionReference = firestore_client.collection('registrations')


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class RecordsDb:

    def get(self, user):
        """Get medical record documents from the Firestore database.

        :param user: username for whom the records shall be retrieved
        :return: all records for the user, empty if nothing found
        """
        records_ref = firestore_client.collection('users/' + user + '/records')
        return [record.get().to_dict() for record in records_ref.list_documents(page_size=50)]


class RegistrationDb:

    @staticmethod
    def create(registration: Registration):
        """Create a registration document on the Firestore database.

        :param registration: Registration object instance
        :return: DocumentReference of the new document created.
        """
        doc_ref: firestore_v1.document.DocumentReference
        timestamp, doc_ref = registrations_coll.add(registration.to_json())
        return doc_ref
