import datetime
from pydantic import BaseModel

from firebase_admin import firestore


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP


class Symptoms(BaseModel):
    cough_intensity: int = 0
    cough_type: str = None
    cough_color: str = None
    breathlessness: bool = False
    fatigued: bool = False
    limb_pain: int = 0
    sniffles: bool = False
    sore_throat: int = 0
    fever: int = 0
    diarrhoea: bool = False


class Record(BaseModel):
    """Symptoms record for a specific user and date."""
    username: str
    date: datetime.date
    symptoms: Symptoms


class Anamnesis(BaseModel):
    username: str
    gender: str
    residence: int
    birthyear: datetime.date
    smoker: bool = False
    pregnant: bool = False
    positive_tested: bool = False
    infection_contact: str = None
    risk_area_stay: bool = False
    medication: str = None
    cardiovascular_desease: bool = False
    pulmonary_problems: bool = False
    chronic_liver_disease: bool = False
    diabetes_mellitus: bool = False
    cancer: bool = False
    immunodeficiency: bool = False
    miscellaneous: str = None
