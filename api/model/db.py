from firebase_admin import firestore, initialize_app
from model.registrations import Registration
# noinspection PyPackageRequirements
from google.cloud import firestore_v1

# Initialize Firestore DB
firebase_app = initialize_app()
firestore_client: firestore_v1.client.Client = firestore.client()
registrations_coll: firestore_v1.collection.CollectionReference = firestore_client.collection('registrations')


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class RegistrationDb:

    def create(self, registration: Registration):
        """Create a registration document on the Firestore database.

        :param registration: Registration object instance
        :return: DocumentReference of the new document created.
        """
        doc_ref: firestore_v1.document.DocumentReference
        timestamp, doc_ref = registrations_coll.add(registration.to_json())
        return doc_ref
