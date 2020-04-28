import os
import unittest

from google.api_core.exceptions import AlreadyExists
from google.cloud.firestore_v1.document import DocumentReference, DocumentSnapshot
from firebase_admin import initialize_app
firebase_app = initialize_app()

from db import UsagePurposesDb, UsersDb, AnamnesesDb, RecordsDb, firestore_client
from model.models import UserStored
from auth import functions
from errors import *

TEST_USER_NAME = u'UnitTestUser1337'
TEST_USER_PW = u'DJfjdialj'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'
PURPOSE_PRIVATE_ID = u'NnqnZ38FMOUFskHFEjUX'
TEST_USER_ID = functions.generate_uuid()
TEST_USER_STORED = UserStored(
    username=TEST_USER_NAME,
    password=functions.hash_pw(TEST_USER_PW),
    usage_purpose=PURPOSE_PRIVATE_ID,
    time_created=functions.get_timestamp()
)

class TestUsersDb(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        # create a user for testing
        firestore_client().collection(u'users').add(
            document_data=TEST_USER_STORED.dict(),
            document_id=TEST_USER_ID
        )

    def tearDown(self):
        firestore_client().document(u'users', TEST_USER_ID).delete()
        firestore_client().document(u'users', TEST_USER_ID+'NEW').delete()

    def test_username_exists(self):
        exists, ref = UsersDb.username_exists(TEST_USER_NAME)
        assert exists == True
        assert ref.get().id == TEST_USER_ID

    def test_username_exists_not(self):
        exists, ref = UsersDb.username_exists('SOmeNoneExistingNamelksjflkjsf')
        assert exists == False
        assert ref == None

    def test_user_id_exists(self):
        exists, ref = UsersDb.user_id_exists(TEST_USER_ID)
        assert exists == True
        assert ref.get().id == TEST_USER_ID

    def test_user_id_exists_not(self):
        exists, ref = UsersDb.user_id_exists('NoneExistingIdlskjdfklsdjfljs')
        assert exists == False
        assert ref == None

    def test_save_new_user_succ(self):
        UsersDb.save_new_user(
            user_id=TEST_USER_ID+'NEW',
            user=UserStored(
                username=TEST_USER_NAME+'NEW',
                password=TEST_USER_STORED.password,
                usage_purpose=TEST_USER_STORED.usage_purpose,
                time_created=TEST_USER_STORED.time_created
            )
        )
        doc: DocumentSnapshot = firestore_client().document(u'users', TEST_USER_ID+'NEW').get()
        assert doc.exists == True
        assert doc.id == TEST_USER_ID+'NEW'
        assert doc.get(u'username') == TEST_USER_NAME+'NEW'

    def test_save_new_user_fail_username(self):
        with self.assertRaises(UserAlreadyExistsException) as context:
            UsersDb.save_new_user(
                user_id=TEST_USER_ID+'NEW',
                user=UserStored(
                    username=TEST_USER_NAME,
                    password=TEST_USER_STORED.password,
                    usage_purpose=TEST_USER_STORED.usage_purpose,
                    time_created=TEST_USER_STORED.time_created
                )
            )
        exc = context.exception
        assert str(exc) == f'This username already exists: {TEST_USER_NAME}'

    def test_save_new_user_fail_user_id(self):
        with self.assertRaises(AlreadyExists) as context:
            UsersDb.save_new_user(
                user_id=TEST_USER_ID,
                user=UserStored(
                    username=TEST_USER_NAME+'NEW',
                    password=TEST_USER_STORED.password,
                    usage_purpose=TEST_USER_STORED.usage_purpose,
                    time_created=TEST_USER_STORED.time_created
                )
            )



# class TestAnamanesisDb(unittest.TestCase):

#     def __init__(self, *args, **kwargs):
#         self._bin = []
#         super().__init__(*args, **kwargs)


# class TestRecordsDb(unittest.TestCase):

#     def __init__(self, *args, **kwargs):
#         self._bin = []
#         super().__init__(*args, **kwargs)

        
class TestUsagePurposeDb(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)
        list_purps = firestore_client().collection(u'usage_purpose').list_documents()
        self.all_purps = []
        for purp in list_purps:
            self.all_purps.append(purp.get().get(u'purpose'))

    def test_get_all(self):
        for purp in UsagePurposesDb.get_all():
            assert purp.get().get(U'purpose') in self.all_purps