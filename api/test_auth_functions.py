import os
import unittest

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
from starlette.testclient import TestClient

from model.models import User, Anamnesis, UserStored
from auth import functions
from errors import *

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
from db import UsersDb  # noqa: E402

from firebase_admin import initialize_app
firebase_app = initialize_app()

TEST_USER_NAME = u'UnitTestUser1337'
TEST_USER_PW = u'DJfjdialj'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'
PURPOSE_PRIVATE_ID = u'NnqnZ38FMOUFskHFEjUX'

os.environ['PORT'] = '8080'


class TestAuthFunctions(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def tearDown(self):
        """Test teardown; is called after every unit test"""
        UsersDb.remove_user_by_username(TEST_USER_NAME)

    def test_generate_uuid(self):
        uuid1: str = functions.generate_uuid()
        uuid2: str = functions.generate_uuid()
        assert len(uuid1) > 5
        assert len(uuid2) > 5
        assert uuid1 != uuid2, 'seperately created uuids match'

    def test_get_timestamp(self):
        t1: int = functions.get_timestamp()
        t2: int = functions.get_timestamp()
        assert t2 >= t1
        t3: int = functions.get_timestamp()
        t4: int = functions.get_timestamp(3600)
        assert t4 >= t3 + 3600

    def test_hash_pw(self):
        hash: str = functions.hash_pw(TEST_USER_PW)
        assert functions.verify_pw(TEST_USER_PW, hash)

    def test_get_purpose_id(self):
        id1: str = functions.get_purpose_id(u'private')
        assert id1 == PURPOSE_PRIVATE_ID
        with self.assertRaises(PurposeIdException) as context:
            functions.get_purpose_id(u'Non existing')
        exc = context.exception
        assert str(exc) == 'Non existing is not a valid purpose identifier'

    def test_generate_access_token(self):
        user = TestAuthFunctions.generate_test_user()
        user_id = functions.generate_uuid()
        t0 = functions.get_timestamp()
        token = functions.generate_access_token(user_id, user)
        t1 = functions.get_timestamp()

        decoded = jwt.decode(token, functions.AUTH_CONFIG['access_token']['secret'], algorithms=functions.AUTH_CONFIG['access_token']['sign_alg'])

        assert decoded['sub'] == user_id
        assert decoded['iat'] >= t0 and decoded['iat'] <= t1
        assert decoded['exp'] >= t0 + functions.AUTH_CONFIG['access_token']['lifetime'] and decoded['exp'] <= t1 + functions.AUTH_CONFIG['access_token']['lifetime'] 

    def test_validate_access_token(self):
        user = TestAuthFunctions.generate_test_user()
        user_id = functions.generate_uuid()
        payload = {
            'iss': 'https://coronalog.de/auth',
            'sub': user_id,
            'iat': functions.get_timestamp(),
            'exp': functions.get_timestamp( functions.AUTH_CONFIG['access_token']['lifetime'] ),
            'username': user.username,
            'roles': ['user']
        }
        UsersDb.save_new_user(user_id, user)
        token = jwt.encode(payload, functions.AUTH_CONFIG['access_token']['secret'], algorithm=functions.AUTH_CONFIG['access_token']['sign_alg'])

        dec_user_id, dec_user = functions.validate_access_token(token, 'user')

        assert dec_user.username == user.username
        assert dec_user.password == user.password
        assert dec_user.time_created == user.time_created
        assert dec_user.usage_purpose == user.usage_purpose
        assert dec_user_id == user_id

    def test_authenticate_user_by_cookies(self):
        test_user_stored = TestAuthFunctions.generate_test_user()
        test_user_id = functions.generate_uuid()
        UsersDb.save_new_user(
            user_id=test_user_id,
            user=test_user_stored
        )

        #generate token
        token = functions.generate_access_token(test_user_id, test_user_stored)
        header, payload, signature = token.decode().split('.')
        
        cookies = {
            functions.AUTH_CONFIG['access_token']['body_cookie_key']: '.'.join((header, payload)),
            functions.AUTH_CONFIG['access_token']['signature_cookie_key']: signature
        }

        val_user_id, val_user = functions.authenticate_user_by_cookies(cookies)

        assert val_user.username == test_user_stored.username
        assert val_user.password == test_user_stored.password
        assert val_user.usage_purpose == test_user_stored.usage_purpose
        assert val_user.time_created == test_user_stored.time_created
        assert val_user_id == test_user_id

    @staticmethod
    def generate_test_user() -> UserStored:
        return UserStored(
            username=TEST_USER_NAME,
            password=functions.hash_pw(TEST_USER_PW),
            time_created=functions.get_timestamp(),
            usage_purpose=PURPOSE_PRIVATE_ID
        )