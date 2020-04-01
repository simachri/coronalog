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
        from db import firestore_client, registrations_coll
        if len(self._bin) > 0:
            delete_batch = firestore_client().batch()
            for doc_to_delete_id in self._bin:
                delete_batch.delete(registrations_coll().document(doc_to_delete_id))
                self._bin.remove(doc_to_delete_id)
            delete_batch.commit()
        # Delete the test user document.
        UsersDb.delete_user(TEST_USER_NAME)

    def test_get_all_records_for_user_is_ok(self):
        dates = ['2020-03-21', '2020-03-22']
        self.create_two_records(self.client, TEST_USER_NAME, dates)
        resp = self.client.get(f"/api/records?username={TEST_USER_NAME}")
        assert resp.status_code == 200
        data: List = resp.json()
        assert len(data) == len(dates)
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

    # def test_create_record_all_symptoms_written_to_db(self):
    #     """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
    #     with self.app.test_client() as client:
    #         test_doc = {'user': TEST_USER_NAME,
    #                     'date': '2020-03-21',
    #                     'symptoms': {
    #                         'cough_intensity': 30,
    #                         'cough_type': 'produktiv',
    #                         'cough_color': 'yellow',
    #                         'breathlessness': True,
    #                         'fatigued': False,
    #                         'limb_pain': 10,
    #                         'sniffles': True,
    #                         'sore_throat': 30,
    #                         'fever': 38.6,
    #                         'diarrhoea': False
    #                     }
    #                     }
    #         post_result = client.post('/api/records', json=test_doc, follow_redirects=True)
    #         assert b'404 Not Found' not in post_result.data
    #         result_doc = json.loads(post_result.data.decode('utf-8'))
    #         for key, value in test_doc['symptoms'].items():
    #             assert result_doc[key] == value
    #
    # def test_update_anamnesis_merge_is_performed(self):
    #     """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
    #     with self.app.test_client() as client:
    #         gender = 'f'
    #         birthyear = 1960
    #         initial_test_doc = {'user': TEST_USER_NAME,
    #                             'characteristics': {
    #                                 'gender': gender,
    #                                 'residence': 12345,
    #                                 'birthyear': birthyear
    #                             }
    #                             }
    #         # Now, we update the residence and add a new value for chronic_liver_disease.
    #         update_doc = {'user': TEST_USER_NAME,
    #                       'characteristics': {
    #                           'residence': 4711,
    #                           'chronic_liver_disease': 'Anything'
    #                       }
    #                       }
    #         client.post('/api/anamneses', json=initial_test_doc, follow_redirects=True)
    #         second_post_result = client.post('/api/anamneses', json=update_doc, follow_redirects=True)
    #         result_doc = json.loads(second_post_result.data.decode('utf-8'))
    #         for key, value in update_doc['characteristics'].items():
    #             assert result_doc[key] == value
    #         assert result_doc['gender'] == gender
    #         assert result_doc['birthyear'] == birthyear
    #
    @staticmethod
    def create_two_records(client, user_name, dates: List):
        for date in dates:
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
            client.post('/api/records', json=test_doc)
