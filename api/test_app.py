import os
import unittest
from typing import List

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
from starlette.testclient import TestClient

from models import User, Anamnesis

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
from db import UsersDb  # noqa: E402

TEST_USER_NAME = u'UnitTestUser1337'
NON_EXISTING_USER_NAME = u'9012nsdkfl0912k'

os.environ['PORT'] = '8080'


class TestApi(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        """Test setup; is called before every unit test"""
        from app import app
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
        UsersDb.delete_user(TEST_USER_NAME)

    def test_get_all_records_for_user_is_ok(self):
        dates = ['2020-03-21', '2020-03-22']
        self.create_two_records(self.client, TEST_USER_NAME, dates)
        resp = self.client.get(f"/api/records?username={TEST_USER_NAME}")
        assert resp.status_code == 200
        data: List = resp.json()
        assert len(data) == len(dates), f'{len(data)} == {len(dates)}'
        for result in data:
            assert 'date' in result
            self.assertIn(result['date'], dates)
            assert 'symptoms' in result
            assert result['symptoms']['breathlessness'] is True
            assert result['symptoms']['cough_intensity'] == 30
            assert result['symptoms']['cough_type'] == 'produktiv'
            assert result['symptoms']['cough_color'] == 'yellow'
            assert result['symptoms']['limb_pain'] == 10
            assert result['symptoms']['fever'] == 38.6

    def test_create_anamnesis_all_symptoms_written_to_db(self):
        """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
        post_in = {'user': {'username': TEST_USER_NAME},
                   'anamnesis_data': {
                       'gender': 'm',
                       'residence': 22765,
                       'birthyear': 1960
                       }}
        resp = self.client.post('/api/anamneses', json=post_in)
        assert resp.status_code == 200
        post_out = resp.json()
        for key, value in post_in['anamnesis_data'].items():
            assert post_out[key] == value

    def test_user_exists_returns_200(self):
        """Check if a status code 200 is returned if a user exists."""
        resp = self.client.get(f"/api/users?username={TEST_USER_NAME}")
        assert resp.status_code == 200

    def test_user_not_exists_returns_404(self):
        """Check if a status code 404 is returned if a user does not exists"""
        resp = self.client.get(f"/api/users?username={NON_EXISTING_USER_NAME}")
        assert resp.status_code == 404

    def test_get_anamnesis_of_user_is_ok(self):
        """Test if the user's anamnesis data is retunred coorectly."""
        anamnesis = {'user': {'username': TEST_USER_NAME},
                     'anamnesis_data': {
                         'gender': 'm',
                         'residence': 12345,
                         'birthyear': 1954,
                         'smoker': False,
                         'pregnant': False,
                         'positive_tested': False,
                         'infection_contact': 'A',
                         'risk_area_stay': True,
                         'medication': 'High blood pressure medicine'
                         }
                     }
        # Create the anamnesis record. This functionality is subject of another test.
        self.client.post('/api/anamneses', json=anamnesis)
        resp = self.client.get(f"/api/anamneses?username={TEST_USER_NAME}")
        assert resp.status_code == 200
        for key, value in anamnesis['anamnesis_data'].items():
            if key == 'user':
                assert resp.json()['username'] == value
            else:
                assert resp.json()[key] == value

    def test_create_record_all_symptoms_written_to_db(self):
        """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
        date = '2020-03-21'
        input_data = TestApi.create_symptoms_record(date, TEST_USER_NAME)
        resp = self.client.post('/api/records', json=input_data)
        assert resp.status_code == 200.
        result_data = resp.json()
        assert result_data['date'] == date
        for key, value in input_data['record']['symptoms'].items():
            result_value = result_data['symptoms'][key]
            assert result_value == value, f"Result value '{result_value}' does not equal expected value '{value}'."

    def test_update_record_merge_is_performed(self):
        """When a symptoms record is updated, make sure that the data is merged on the DB."""
        date = '2020-04-01'
        initial_data = {'user': {'username': TEST_USER_NAME},
                        'record': {
                            'date': date,
                            'symptoms': {
                                'cough_intensity': 30,
                                'cough_type': 'produktiv',
                                'cough_color': 'green',
                                'breathlessness': True,
                                'fatigued': False,
                                'sore_throat': 30,
                                'fever': 38.6,
                                'diarrhoea': False
                                }
                            }
                        }
        self.client.post('/api/records', json=initial_data)
        update_data = self.create_symptoms_record(date, TEST_USER_NAME)
        update_resp = self.client.post('/api/records', json=update_data)
        assert update_resp.status_code == 200.
        result_json = update_resp.json()
        for key, value in update_data['record']['symptoms'].items():
            assert result_json['symptoms'][key] == value
        assert result_json['symptoms']['cough_intensity'] == 30
        assert result_json['symptoms']['limb_pain'] == 10
        assert result_json['symptoms']['cough_color'] == 'yellow'
        assert result_json['symptoms']['sniffles'] is True

    def test_update_anamnesis_merge_is_performed(self):
        """When an anamnesis record is updated, make sure that the data is merged on the DB."""
        gender = 'f'
        birthyear = 1960
        residence = 12345
        chronic_liver_disease = True
        initial_data = {'user': {'username': TEST_USER_NAME},
                        'anamnesis_data': {
                            'gender': gender,
                            'residence': residence,
                            'birthyear': birthyear,
                            'chronic_liver_disease': chronic_liver_disease
                            }
                        }
        # Now, we update the residence and add a new value for chronic_liver_disease.
        infection_contact = 'A'
        update_data = {'user': {'username': TEST_USER_NAME},
                       'anamnesis_data': {
                           'gender': gender,
                           'residence': residence,
                           'birthyear': birthyear,
                           'infection_contact': infection_contact,
                           }
                       }
        self.client.post('/api/anamneses', json=initial_data)
        update_resp = self.client.post('/api/anamneses', json=update_data)
        assert update_resp.status_code == 200.
        result_json = update_resp.json()
        for key, value in update_data['anamnesis_data'].items():
            assert result_json[key] == value
            assert result_json['chronic_liver_disease'] is chronic_liver_disease
            assert result_json['infection_contact'] == infection_contact

    @staticmethod
    def create_two_records(client, user_name, dates: List):
        for date in dates:
            test_doc = TestApi.create_symptoms_record(date, user_name)
            client.post('/api/records', json=test_doc)

    @staticmethod
    def create_symptoms_record(date, user_name):
        test_doc = {'user': {'username': user_name},
                    'record': {
                        'date': date,
                        'symptoms': {
                            'cough_intensity': 30,
                            'cough_type': 'produktiv',
                            'cough_color': 'yellow',
                            'breathlessness': True,
                            'fatigued': False,
                            'limb_pain': 10,
                            'sniffles': True,
                            'sore_throat': 30,
                            'fever': 38.6,
                            'diarrhoea': False
                            }
                        }
                    }
        return test_doc
