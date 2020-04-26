import os
import unittest
from typing import List
import jwt
import random
import string

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
from starlette.testclient import TestClient
from starlette.responses import Response

from models import User, Anamnesis, UserStored
from auth.functions import AUTH_CONFIG, hash_pw, generate_uuid, get_timestamp

# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
from db import UsersDb  # noqa: E402

TEST_USER_NAME = u'UnitTestUser1337'
TEST_USER_PW = u'DJfjdialj'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'
PURPOSE_PRIVATE_ID = u'NnqnZ38FMOUFskHFEjUX'

os.environ['PORT'] = '8080'


class TestAuth(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        """Test setup; is called before every unit test"""
        from api.app import app
        self.client = TestClient(app)
        # Create a document in the database for the test user.
        UsersDb.save_new_user(
            user_id=generate_uuid(),
            user=UserStored(
                username=TEST_USER_NAME,
                password=hash_pw(TEST_USER_PW),
                time_created=get_timestamp(),
                usage_purpose=PURPOSE_PRIVATE_ID
            )
        )

    def tearDown(self):
        """Test teardown; is called after every unit test"""
        UsersDb.remove_user_by_username(TEST_USER_NAME)
        UsersDb.remove_user_by_username(TEST_USER_NAME+'NEW')

    def test_sign_up_new_user_successful(self):
        post_body = {
            'username': TEST_USER_NAME+'NEW',
            'password': TEST_USER_PW,
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        res = self.client.post('/auth/signup', json=post_body)
        
        assert res.status_code == 200
        TestAuth.check_login_response(res, user_name_appendix='NEW')

    def test_sign_up_user_exists(self):
        post_body = {
            'username': TEST_USER_NAME,
            'password': TEST_USER_PW,
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        res = self.client.post('/auth/signup', json=post_body)
        assert res.status_code == 400
        TestAuth.check_error_response(400, res.json(), 'USER_EXISTS')

    def test_signup_missing_field(self):
        post_body_1 = {
            'password': TEST_USER_PW,
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        post_body_2 = {
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        post_body_3 = {
        }
        res = self.client.post('/auth/signup', json=post_body_1)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'username', 'value_error.missing')
        res = self.client.post('/auth/signup', json=post_body_2)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'username', 'value_error.missing')
        TestAuth.check_err_body_param(res, 'password', 'value_error.missing')
        res = self.client.post('/auth/signup', json=post_body_3)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'username', 'value_error.missing')
        TestAuth.check_err_body_param(res, 'password', 'value_error.missing')
        TestAuth.check_err_body_param(res, 'usage_purpose', 'value_error.missing')

    def test_signup_pw_too_short(self):
        post_body = {
            'username': TEST_USER_NAME,
            'password': '123',
            'usage_purpose': PURPOSE_PRIVATE_ID
        }
        res = self.client.post('/auth/signup', json=post_body)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'password', 'value_error.any_str.min_length')

    def test_sign_in_successful(self):
        post_body = {
            'username': TEST_USER_NAME,
            'password': TEST_USER_PW
        }
        res = self.client.post('/auth/signin', json=post_body)
        assert res.status_code == 200
        TestAuth.check_login_response(res)

    def test_signin_wrong_password(self):
        post_body = {
            'username': TEST_USER_NAME,
            'password': TEST_USER_PW+'WRONG'
        }
        res = self.client.post('/auth/signin', json=post_body)
        assert res.status_code == 400
        TestAuth.check_error_response(400, res.json(), 'WRONG_PASSWORD')

    def test_signin_user_not_exists(self):
        post_body = {
            'username': TEST_USER_NAME+'kjhkh', # + ''.join((random.choice(string.ascii_lowercase) for _ in range(5))),
            'password': TEST_USER_PW
        }
        res = self.client.post('/auth/signin', json=post_body)
        assert res.status_code == 400
        TestAuth.check_error_response(400, res.json(), 'USER_NOT_FOUND')

    def test_signin_missing_field(self):
        post_body_1 = {
            'password': TEST_USER_PW
        }
        post_body_3 = {
        }
        res = self.client.post('/auth/signin', json=post_body_1)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'username', 'value_error.missing')
        res = self.client.post('/auth/signin', json=post_body_3)
        assert res.status_code == 422
        TestAuth.check_err_body_param(res, 'username', 'value_error.missing')
        TestAuth.check_err_body_param(res, 'password', 'value_error.missing')

    @staticmethod
    def check_error_response(status: int, res_body: dict, key: str) -> None:
        assert 'error' in res_body
        assert res_body['error']['code'] == status
        assert res_body['error']['key'] == key

    @staticmethod
    def check_err_body_param(res: Response, field: str, type: str) -> None:
        res_body = res.json()
        assert 'detail' in res_body
        contained = False
        for d in res_body['detail']:
            if 'body' in d['loc'] and field in d['loc'] and d['type'] == type:
                contained = True
        assert contained == True

    @staticmethod
    def check_login_response(res: Response, user_name_appendix: str = '') -> None:
        res_body = res.json();
        assert res_body['username'] == TEST_USER_NAME+user_name_appendix
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
        assert dec['username'] == TEST_USER_NAME+user_name_appendix