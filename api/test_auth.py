import os
import unittest
from typing import List
import jwt

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
from starlette.testclient import TestClient

from models import User, Anamnesis, UserStored
from auth.functions import AUTH_CONFIG, hash_pw, generate_uuid

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
from db import UsersDb  # noqa: E402

TEST_USER_NAME = u'UnitTestUser1337'
TEST_USER_PW = u'DJfjdialj'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'
PURPOSE_PRIVATE_ID = u'NnqnZ38FMOUFskHFEjUX'

os.environ['PORT'] = '8080'


class TestApi(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        """Test setup; is called before every unit test"""
        from api.app import app
        self.client = TestClient(app)
        # Create a document in the database for the test user.
        user = User(username=TEST_USER_NAME)
        UsersDb.set_user(user,
                         anamnesis=Anamnesis(
                                 user=user,
                                 gender='male',
                                 residence=22765,
                                 birthyear=1951
                                 ))

    def tearDown(self):
        """Test teardown; is called after every unit test"""
        UsersDb.remove_user_by_username(TEST_USER_NAME)

    def test_sign_up_new_user_successful(self):
        post_body = {
            'username': TEST_USER_NAME,
            'password': TEST_USER_PW,
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        res = self.client.post('/auth/signup', json=post_body)
        
        assert res.status_code == 200
        res_body = res.json()
        assert res_body['username'] == TEST_USER_NAME
        assert res_body['expires_in'] == AUTH_CONFIG['access_token']['lifetime']
        # assert cookies
        cookies = res.headers['set-cookie'].split(',')
        cnt = 0
        token = ''
        for cookie in cookies:
            if cookie.strip().startswith(AUTH_CONFIG['access_token']['body_cookie_key']):
                token = cookie.strip().split(';')[0].split('=')[1] + token
                cnt += 1
            if cookie.strip().startswith(AUTH_CONFIG['access_token']['signature_cookie_key']):
                token += '.' + cookie.strip().split(';')[0].split('=')[1]
                cnt += 1
        assert cnt == 2, 'Not both cookies could be found'
        dec = jwt.decode(token, AUTH_CONFIG['access_token']['secret'], algorithms=AUTH_CONFIG['access_token']['sign_alg'])
        assert dec['username'] == TEST_USER_NAME

    def test_sign_up_user_exists(self):
        new_user = UserStored(
            username=TEST_USER_NAME,
            password=hash_pw(TEST_USER_PW),
            time_created=10000,
            usage_purpose=PURPOSE_PRIVATE_ID
        )
        user_id = generate_uuid()
        UsersDb.save_new_user(user_id, new_user)

        post_body = {
            'username': TEST_USER_NAME,
            'password': TEST_USER_PW,
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        res = self.client.post('/auth/signup', json=post_body)
        assert res.status_code == 400
        res_body = res.json()
        assert 'error' in res_body
        assert res_body['error']['code'] == 400
        assert res_body['error']['key'] == 'USER_EXISTS'