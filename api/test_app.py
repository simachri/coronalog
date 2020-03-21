import json
import os
import unittest
from datetime import datetime

from flask import Flask

# For local testing, the Firebase credentials are provided from a local file,
# see WHREG-8. We need to set the environment variable BEFORE we
# import our app. Otherwise we receive a "missing credentials" exception.
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = 'firebase_key.json'
# We need to suppress the PEP8 error 'import not at top'
import registrations  # noqa: E402
import db  # noqa: E402

COMMENT = u'Ich mag keinen Käse'
CITY = u'Hamburg'
ZIP_CODE = 70736
STREET_W_HOUSE_NO = u'Best road 14a'
LAST_NAME = u'Bar'
FIRST_NAME = u'Foo'
EVENT_NAME = u'Waldheim 2020, 3. Durchgang'


class TestRegistration(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        """Create Flask testing client"""
        self.app: Flask = Flask(__name__)
        from app import main
        self.app.register_blueprint(main)
        # Set Flask to testing mode such that exceptions within the application
        # are propagated to our test coding.
        self.app.testing = True

    def tearDown(self):
        if len(self._bin) > 0:
            delete_batch = db.firestore_client.batch()
            for doc_to_delete_id in self._bin:
                delete_batch.delete(db.registrations_coll.document(doc_to_delete_id))
                self._bin.remove(doc_to_delete_id)
            delete_batch.commit()

    def test_api_create_new_registration_is_ok(self):
        with self.app.test_client() as client:
            test_doc = {'event_name': 'Waldheim 2020, 3. Durchgang',
                        'first_name': 'Foo',
                        'last_name': 'Bar',
                        'birthday': '2002-08-03T00:00:00.000Z',
                        'street_w_house_no': 'Best road ever 14a',
                        'zip_code': 70736,
                        'city': 'Hamburg',
                        'comment': 'I don''t like cheese.'}
            post_result = client.post('/registrations', json=test_doc, follow_redirects=True
                                      )
            assert b'404 Not Found' not in post_result.data
            result_doc = json.loads(post_result.data.decode('utf-8'))
            for key, value in test_doc.items():
                assert result_doc[key] == value
            self.add_to_bin(result_doc['id'])

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
