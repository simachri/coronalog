import os
import unittest
from datetime import datetime

from google.api_core.exceptions import AlreadyExists
from google.cloud.firestore_v1.document import DocumentReference, DocumentSnapshot
from firebase_admin import initialize_app
firebase_app = initialize_app()

from model.db import UsagePurposesDb, UsersDb, AnamnesisDb, RecordsDb, firestore_client, convert_date_to_str, convert_str_to_date
from model.models import UserStored, Symptoms, Record, Anamnesis
from auth import functions
import errors

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
TEST_USER_RECORD_3 = Record(
    date=datetime.strptime('2020-04-27', '%Y-%m-%d'),
    symptoms=Symptoms(
        cough_intensity = 4,
        cough_type = 'yellow',
        cough_color = 'yellow',
        breathlessness = False,
        fatigued = True,
        limb_pain = 4,
        sniffles = False,
        sore_throat = 4,
        fever = 40,
        diarrhoea = False
    )
)
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
        rec_ref = firestore_client().document(u'users', TEST_USER_ID).collection(u'records').document(convert_date_to_str(TEST_USER_RECORD_1.date))
        rec_ref.set(TEST_USER_RECORD_1.symptoms.dict())
        firestore_client().document(u'users', TEST_USER_ID).set(
            document_data={'anamnesis' : TEST_USER_ANAMNESIS.dict()},
            merge=True
        )

    def tearDown(self):
        UsersDb.remove_user_by_id(TEST_USER_ID)
        UsersDb.remove_user_by_id(TEST_USER_ID+'NEW')

    def test_get_user_id(self):
        id = UsersDb.get_user_id(TEST_USER_NAME)
        assert id == TEST_USER_ID
        not_user = TEST_USER_NAME+'notExistingjsdflkjslfj'
        with self.assertRaises(errors.UserNotExistsException) as context:
            UsersDb.get_user_id(not_user)
        assert str(context.exception) == f'User {not_user} does not exist'

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
        with self.assertRaises(errors.UserAlreadyExistsException) as context:
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

    def test_get_user_succ(self):
        user_id, user = UsersDb.get_user_by_username(TEST_USER_NAME)
        assert user_id == TEST_USER_ID
        assert user.username == TEST_USER_STORED.username
        assert user.password == TEST_USER_STORED.password
        assert user.usage_purpose == TEST_USER_STORED.usage_purpose
        assert user.time_created == TEST_USER_STORED.time_created

    def test_get_user_fail(self):
        not_user = TEST_USER_NAME+'Not_existsingsjflksjf'
        with self.assertRaises(LookupError) as context:
            UsersDb.get_user_by_username(not_user)
        exc = context.exception
        assert str(exc) == f'No database document exists for user {not_user}.'

    def test_get_user_by_id_succ(self):
        user = UsersDb.get_user_by_id(TEST_USER_ID)
        assert user.username == TEST_USER_STORED.username
        assert user.password == TEST_USER_STORED.password
        assert user.usage_purpose == TEST_USER_STORED.usage_purpose
        assert user.time_created == TEST_USER_STORED.time_created

    def test_get_user_by_id_fail(self):
        not_user = TEST_USER_ID+'Not_existsingsjflksjf'
        with self.assertRaises(LookupError) as context:
            UsersDb.get_user_by_id(not_user)
        exc = context.exception
        assert str(exc) == f'User with id {not_user} does not exist.'

    def test_remove_user_by_id(self):
        UsersDb.remove_user_by_id(TEST_USER_ID)
        snap = firestore_client().document(u'users', TEST_USER_ID).get()
        assert snap.exists == False
        col = firestore_client().collection(u'users', TEST_USER_ID, u'records')
        contains_sth = False
        for ref in col.list_documents():
            contains_sth = True
            break
        assert contains_sth == False

    def test_remove_user_by_username(self):
        UsersDb.remove_user_by_username(TEST_USER_NAME)
        snap = firestore_client().document(u'users', TEST_USER_ID).get()
        assert snap.exists == False
        col = firestore_client().collection(u'users', TEST_USER_ID, u'records')
        contains_sth = False
        for ref in col.list_documents():
            contains_sth = True
            break
        assert contains_sth == False

    def test_update_user(self):
        anamnesis_to_update = {
            'gender': 'w',
            'positive_tested': False
        }
        ret_a = UsersDb.update_user(TEST_USER_ID, Anamnesis.parse_obj(anamnesis_to_update))

        assert ret_a.gender == 'w'
        assert ret_a.positive_tested == False
        assert ret_a.residence == 12345

        doc_ref = firestore_client().document(u'users', TEST_USER_ID)
        db_rec = doc_ref.get().to_dict()
        assert db_rec['anamnesis']['gender'] == 'w'
        assert db_rec['anamnesis']['positive_tested'] == False
        assert db_rec['anamnesis']['residence'] == 12345




class TestAnamanesisDb(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        # create a user for testing
        firestore_client().collection(u'users').add(
            document_data=TEST_USER_STORED.dict(),
            document_id=TEST_USER_ID
        )
        rec_ref = firestore_client().document(u'users', TEST_USER_ID).collection(u'records').document(convert_date_to_str(TEST_USER_RECORD_1.date))
        rec_ref.set(TEST_USER_RECORD_1.symptoms.dict())
        firestore_client().document(u'users', TEST_USER_ID).set(
            document_data={'anamnesis' : TEST_USER_ANAMNESIS.dict()},
            merge=True
        )

    def tearDown(self):
        UsersDb.remove_user_by_id(TEST_USER_ID)
        UsersDb.remove_user_by_id(TEST_USER_ID+'NEW')

    def test_get_by_user_id(self):
        anamnesis: Anamnesis = AnamnesisDb.get_by_user_id(TEST_USER_ID)
        self.assertDictEqual(anamnesis.dict(), TEST_USER_ANAMNESIS.dict())

    def test_get_by_username(self):
        anamnesis: Anamnesis = AnamnesisDb.get_by_username(TEST_USER_NAME)
        self.assertDictEqual(anamnesis.dict(), TEST_USER_ANAMNESIS.dict())
    
    def test_set_anamanesis(self):
        anamnesis_to_update = {
            'gender': 'w',
            'positive_tested': False
        }
        updated_anamnesis = {**TEST_USER_ANAMNESIS.dict(), **anamnesis_to_update}
        ret_a = AnamnesisDb.set_anamnesis(TEST_USER_ID, Anamnesis.parse_obj(anamnesis_to_update))

        self.assertDictEqual(ret_a.dict(), updated_anamnesis)

        doc_ref = firestore_client().document(u'users', TEST_USER_ID)
        ret_b = doc_ref.get().get(u'anamnesis')
        self.assertDictEqual(ret_b, updated_anamnesis)


class TestRecordsDb(unittest.TestCase):

    def __init__(self, *args, **kwargs):
        self._bin = []
        super().__init__(*args, **kwargs)

    def setUp(self):
        # create a user for testing
        firestore_client().collection(u'users').add(
            document_data=TEST_USER_STORED.dict(),
            document_id=TEST_USER_ID
        )
        rec_ref_1 = firestore_client().document(u'users', TEST_USER_ID).collection(u'records').document(convert_date_to_str(TEST_USER_RECORD_1.date))
        rec_ref_1.set(TEST_USER_RECORD_1.symptoms.dict())
        rec_ref_2 = firestore_client().document(u'users', TEST_USER_ID).collection(u'records').document(convert_date_to_str(TEST_USER_RECORD_2.date))
        rec_ref_2.set(TEST_USER_RECORD_2.symptoms.dict())
        firestore_client().document(u'users', TEST_USER_ID).set(
            document_data={'anamnesis' : TEST_USER_ANAMNESIS.dict()},
            merge=True
        )

    def tearDown(self):
        UsersDb.remove_user_by_id(TEST_USER_ID)
        UsersDb.remove_user_by_id(TEST_USER_ID+'NEW')

    def test_get_by_user_id(self):
        recs: List[Record] = RecordsDb.get_by_user_id(TEST_USER_ID)
        assert len(recs) == 2
        i = 0
        for rec in recs:
            if rec.date == TEST_USER_RECORD_1.date:
                self.assertDictEqual(rec.symptoms.dict(), TEST_USER_RECORD_1.symptoms.dict())
                i += 1
            if rec.date == TEST_USER_RECORD_2.date:
                self.assertDictEqual(rec.symptoms.dict(), TEST_USER_RECORD_2.symptoms.dict())
                i += 1
        assert i == 2

    def test_set_record_new(self):
        RecordsDb.set_record(TEST_USER_ID, TEST_USER_RECORD_3)
        all_recs = firestore_client().collection(u'users', TEST_USER_ID, u'records').list_documents()
        i = 0
        for rec in all_recs:
            if convert_str_to_date(rec.get().id) == TEST_USER_RECORD_1.date:
                self.assertDictEqual(rec.get().to_dict(), TEST_USER_RECORD_1.symptoms.dict())
                i += 1
            if convert_str_to_date(rec.get().id) == TEST_USER_RECORD_2.date:
                self.assertDictEqual(rec.get().to_dict(), TEST_USER_RECORD_2.symptoms.dict())
                i += 1
            if convert_str_to_date(rec.get().id) == TEST_USER_RECORD_3.date:
                self.assertDictEqual(rec.get().to_dict(), TEST_USER_RECORD_3.symptoms.dict())
                i += 1
        assert i == 3

    def test_set_record_merge(self):
        to_update_symptoms = {
            'sore_throat': 1,
            'diarrhoea': False
        }
        to_update = Record(
            date=TEST_USER_RECORD_1.date,
            symptoms=Symptoms.parse_obj(to_update_symptoms)
        )
        RecordsDb.set_record(TEST_USER_ID, to_update)
        x = TEST_USER_RECORD_1.dict()['symptoms']
        updated_symptoms = {**TEST_USER_RECORD_1.dict()['symptoms'], **to_update_symptoms}

        rec_ref: DocumentReference = firestore_client().document(u'users', TEST_USER_ID, u'records', convert_date_to_str(TEST_USER_RECORD_1.date))
        self.assertDictEqual(rec_ref.get().to_dict(), updated_symptoms)

        
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