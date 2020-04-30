import os
import unittest
from typing import List
from datetime import datetime

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
from starlette.testclient import TestClient

from auth.functions import AUTH_CONFIG, hash_pw, generate_uuid, get_timestamp, generate_access_token
from models import User, Anamnesis, UserStored, Record, Symptoms
import errors

os.environ["CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
from db import UsersDb, AnamnesisDb, RecordsDb, convert_date_to_str  # noqa: E402

TEST_USER_NAME = u'UnitTestUser1337'
TEST_USER_PW = u'DJfjdialj'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'
PURPOSE_PRIVATE_ID = u'NnqnZ38FMOUFskHFEjUX'
TEST_USER_ANAMNESIS = Anamnesis(
    gender = 'm',
    residence = 12345,
    birthyear = 1999,
    smoker = True,
    pregnant = True,
    positive_tested = True,
    infection_contact = None,
    risk_area_stay = True,
    medication = 'some',
    cardiovascular_desease = True,
    pulmonary_problems = True,
    chronic_liver_disease = True,
    diabetes_mellitus = True,
    cancer = True,
    immunodeficiency = True,
    miscellaneous = None
)
TEST_USER_RECORD_1 = Record(
    date=datetime.now(),
    symptoms=Symptoms(
        cough_intensity = 2,
        cough_type = 'yellow',
        cough_color = 'yellow',
        breathlessness = True,
        fatigued = True,
        limb_pain = 4,
        sniffles = True,
        sore_throat = 4,
        fever = 39.1,
        diarrhoea = True
    )
)
TEST_USER_RECORD_2 = Record(
    date=datetime.strptime('2020-04-28', '%Y-%m-%d'),
    symptoms=Symptoms(
        cough_intensity = 1,
        cough_type = 'yellow',
        cough_color = 'yellow',
        breathlessness = False,
        fatigued = True,
        limb_pain = 1,
        sniffles = False,
        sore_throat = 1,
        fever = 39.1,
        diarrhoea = False
    )
)
TEST_NEW_USER_RECORD = Record(
    date=datetime.strptime('2020-04-27', '%Y-%m-%d'),
    symptoms=Symptoms(
        cough_intensity = 3,
        cough_type = 'yellow',
        cough_color = 'yellow',
        breathlessness = True,
        fatigued = False,
        limb_pain = 1,
        sniffles = False,
        sore_throat = 1,
        fever = 36,
        diarrhoea = True
    )
)
TEST_USER_ID = generate_uuid()
TEST_USER_STORED = UserStored(
    username=TEST_USER_NAME,
    password=hash_pw(TEST_USER_PW),
    time_created=get_timestamp(),
    usage_purpose=PURPOSE_PRIVATE_ID
)

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
        UsersDb.save_new_user(
            user_id=TEST_USER_ID,
            user=TEST_USER_STORED
        )
        AnamnesisDb.set_anamnesis(TEST_USER_ID, TEST_USER_ANAMNESIS)
        RecordsDb.set_record(TEST_USER_ID, TEST_USER_RECORD_1)
        RecordsDb.set_record(TEST_USER_ID, TEST_USER_RECORD_2)

    def tearDown(self):
        """Test teardown; is called after every unit test"""
        UsersDb.remove_user_by_username(TEST_USER_NAME)

    def test_get_check(self):
        res = self.client.get(f'/api/check?username={TEST_USER_NAME}')
        assert res.status_code == 200, 'status code should be 200'
        assert res.json()['exists'] == True
        res = self.client.get(f'/api/check?username={NON_EXISTING_USER_NAME}')
        assert res.status_code == 200, 'status code should be 200'
        assert res.json()['exists'] == False

    def test_get_all_records_for_user_is_ok(self):
        res = self.client.get(
            f'/api/records',
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 200, 'status code should be 200'

        body: List = res.json()
        assert len(body) == 2, f'{len(body)} == 2'
        assert any( r['date'] == convert_date_to_str(TEST_USER_RECORD_1.date) for r in body ), 'test record 1 not in body'
        assert any( r['date'] == convert_date_to_str(TEST_USER_RECORD_2.date) for r in body ), 'test record 2 not in body'
        for result_rec in body:
            assert 'date' in result_rec
            if result_rec['date'] == convert_date_to_str(TEST_USER_RECORD_1.date):
                self.assertDictEqual(result_rec['symptoms'], TEST_USER_RECORD_1.dict()['symptoms']), 'test record 1 should equal db entry'
            if result_rec['date'] == convert_date_to_str(TEST_USER_RECORD_2.date):
                self.assertDictEqual(result_rec['symptoms'], TEST_USER_RECORD_2.dict()['symptoms']), 'test record 2 should equal db entry'

    def test_get_record(self):
        date_str = convert_date_to_str(TEST_USER_RECORD_1.date)
        res = self.client.get(
            f'/api/record?date={date_str}',
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 200, 'status code should be 200'

        assert res.json()['date'] == convert_date_to_str(TEST_USER_RECORD_1.date)
        self.assertDictEqual(res.json()['symptoms'], TEST_USER_RECORD_1.dict()['symptoms'], 'test record 1 should be returned')

    def test_create_anamnesis_all_symptoms_written_to_db(self):
        """When a new anamnesis record is created, make sure that all symptoms are written to the DB."""
        post_in = {'anamnesis_data': {
                       'gender': 'w',
                       'residence': 22765,
                       'birthyear': 1960
                       }}
        res = self.client.post(
            '/api/anamnesis',
            json=post_in,
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 200, 'status code should be 200'

        post_out = res.json()
        new_anamnesis = {**TEST_USER_ANAMNESIS.dict(), **post_in['anamnesis_data']}
        self.assertDictEqual(post_out, new_anamnesis, 'anamnesis record from db should include changes and all old values')

    def test_get_anamnesis_of_user_is_ok(self):
        """Test if the user's anamnesis data is retunred coorectly."""
        res = self.client.get(
            f"/api/anamnesis",
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 200, 'status code should be 200'

        self.assertDictEqual(res.json(), TEST_USER_ANAMNESIS.dict(), 'should return test anamnesis data')

    def test_post_record(self):
        post_in = {
            'date': convert_date_to_str(TEST_NEW_USER_RECORD.date),
            'symptoms': TEST_NEW_USER_RECORD.dict()['symptoms']
        }
        res = self.client.post(
            'api/record',
            json=post_in,
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 200, 'status code should be 200'

        body = res.json()
        assert body['date'] == convert_date_to_str(TEST_NEW_USER_RECORD.date)
        self.assertDictEqual(body['symptoms'], TEST_NEW_USER_RECORD.dict()['symptoms'])

    def test_malformed_date_str(self):
        date_str = '2000/05/05'
        res = self.client.get(
            f'/api/record?date={date_str}',
            cookies=TestApi.get_valid_token_as_cookies()
        )
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.MALFORMED_DATE, f'Key should be {errors.MALFORMED_DATE}'

    def test_fail_without_cookies(self):
        res = self.client.get('/api/records')
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.get('/api/record?date=2020-04-28')
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        post_in = {
            'date': convert_date_to_str(TEST_NEW_USER_RECORD.date),
            'symptoms': TEST_NEW_USER_RECORD.dict()['symptoms']
        }
        res = self.client.post('/api/record', json=post_in)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.get('/api/anamnesis')
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.post('/api/anamnesis', json={'anamnesis': TEST_USER_ANAMNESIS.dict()})
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

    def test_fail_with_corrupt_cookies(self):
        cookies = TestApi.get_valid_token_as_cookies()
        for key in cookies:
            cookies[key] = cookies[key] + 'df'

        res = self.client.get('/api/records', cookies=cookies)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.get('/api/record?date=2020-04-28', cookies=cookies)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        post_in = {
            'date': convert_date_to_str(TEST_NEW_USER_RECORD.date),
            'symptoms': TEST_NEW_USER_RECORD.dict()['symptoms']
        }
        res = self.client.post('/api/record', json=post_in, cookies=cookies)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.get('/api/anamnesis', cookies=cookies)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

        res = self.client.post('/api/anamnesis', json={'anamnesis': TEST_USER_ANAMNESIS.dict()}, cookies=cookies)
        assert res.status_code == 400, 'status code should be 400'
        assert res.json()['error']['key'] == errors.INVALID_TOKEN

    @staticmethod
    def get_valid_token_as_cookies():
        token = generate_access_token(TEST_USER_ID, TEST_USER_STORED)
        header, payload, signature = token.decode().split('.')

        cookies = {
            AUTH_CONFIG['access_token']['body_cookie_key']: '.'.join((header, payload)),
            AUTH_CONFIG['access_token']['signature_cookie_key']: signature
        }
        return cookies
