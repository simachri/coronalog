import json
import os
import unittest
from datetime import datetime
from typing import List

from flask import Flask

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
import registrations  # noqa: E402
from db import UsersDb  # noqa: E402

COMMENT = u'Ich mag keinen Käse'
CITY = u'Hamburg'
ZIP_CODE = 70736
STREET_W_HOUSE_NO = u'Best road 14a'
LAST_NAME = u'Bar'
FIRST_NAME = u'Foo'
EVENT_NAME = u'Waldheim 2020, 3. Durchgang'
TEST_USER_NAME = u'Unit Test User 1337'


class TestRegistration(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        """Test setup; is called before every unit test"""
        self.app: Flask = Flask(__name__)
        from app import main
        self.app.register_blueprint(main)
        # Set Flask to testing mode such that exceptions within the application
        # are propagated to our test coding.
        self.app.testing = True
        # Create a document in the database for the test user.
        UsersDb.set_user(TEST_USER_NAME)

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
        with self.app.test_client() as client:
            dates = ['2020-03-21', '2020-03-22']
            self.create_two_records(client, TEST_USER_NAME, dates)
            get_result = client.get('/records', query_string=dict(user=TEST_USER_NAME))
            assert b'404 Not Found' not in get_result.data
            result_data: List = json.loads(get_result.data.decode('utf-8'))
            assert len(result_data) == len(dates)
            for result in result_data:
                assert 'user' in result
                assert 'date' in result
                assert 'symptoms' in result
                assert result['user'] == TEST_USER_NAME
                self.assertIn(result['date'], dates)
                assert result['symptoms']['breathlessness'] is True

    def test_create_anamnesis_all_symptoms_written_to_db(self):
        """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
        with self.app.test_client() as client:
            test_doc = {'user': TEST_USER_NAME,
                        'characteristics': {
                            'gender': 'm',
                            'residence': 12345,
                            'birthyear': 1960
                        }
                        }
            post_result = client.post('/anamneses', json=test_doc, follow_redirects=True)
            assert b'404 Not Found' not in post_result.data
            result_doc = json.loads(post_result.data.decode('utf-8'))
            for key, value in test_doc['characteristics'].items():
                assert result_doc[key] == value

    def test_create_record_all_symptoms_written_to_db(self):
        """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
        with self.app.test_client() as client:
            test_doc = {'user': TEST_USER_NAME,
                        'date': '2020-03-21',
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
            post_result = client.post('/records', json=test_doc, follow_redirects=True)
            assert b'404 Not Found' not in post_result.data
            result_doc = json.loads(post_result.data.decode('utf-8'))
            for key, value in test_doc['symptoms'].items():
                assert result_doc[key] == value

    def test_update_anamnesis_merge_is_performed(self):
        """When a new symptoms record is created, make sure that all symptoms are written to the DB."""
        with self.app.test_client() as client:
            gender = 'f'
            birthyear = 1960
            initial_test_doc = {'user': TEST_USER_NAME,
                                'characteristics': {
                                    'gender': gender,
                                    'residence': 12345,
                                    'birthyear': birthyear
                                }
                                }
            # Now, we update the residence and add a new value for chronic_liver_disease.
            update_doc = {'user': TEST_USER_NAME,
                          'characteristics': {
                              'residence': 4711,
                              'chronic_liver_disease': 'Anything'
                          }
                          }
            client.post('/anamneses', json=initial_test_doc, follow_redirects=True)
            second_post_result = client.post('/anamneses', json=update_doc, follow_redirects=True)
            result_doc = json.loads(second_post_result.data.decode('utf-8'))
            for key, value in update_doc['characteristics'].items():
                assert result_doc[key] == value
            assert result_doc['gender'] == gender
            assert result_doc['birthyear'] == birthyear

    def test_transform_to_dict_is_ok(self):
        """Transformation to dictionary for Firestore matches expected results"""
        birthday = datetime(2002, 8, 3).date()
        created_at = datetime.utcnow()
        registration = registrations.Registration(None, EVENT_NAME, FIRST_NAME, LAST_NAME, birthday, STREET_W_HOUSE_NO,
                                                  ZIP_CODE, CITY, COMMENT, created_at)
        registr_attr = vars(registration)
        self.assertEqual(len(registr_attr), 9)
        self.assertEqual(registr_attr['event_name'], EVENT_NAME)
        self.assertEqual(registr_attr['first_name'], FIRST_NAME)
        self.assertEqual(registr_attr['last_name'], LAST_NAME)
        self.assertEqual(registr_attr['birthday'], birthday)
        self.assertEqual(registr_attr['street_w_house_no'], STREET_W_HOUSE_NO)
        self.assertEqual(registr_attr['zip_code'], ZIP_CODE)
        self.assertEqual(registr_attr['city'], CITY)
        self.assertEqual(registr_attr['comment'], COMMENT)
        self.assertEqual(registr_attr['created_at'], created_at)

    def add_to_bin(self, doc_id):
        self._bin.append(doc_id)

    @staticmethod
    def create_two_records(client, user_name, dates: List):
        for date in dates:
            test_doc = {'user': user_name,
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
            client.post('/records', json=test_doc)
