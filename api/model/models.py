import datetime
from pydantic import BaseModel, Field

from firebase_admin import firestore


def get_timestamp():
    """Returns a server timestamp."""
    return firestore.firestore.SERVER_TIMESTAMP

class ReturnMessage(BaseModel):
    message: str

class ErrorInnerMessage(BaseModel):
    code: int
    key: str
    message: str

class ErrorMessage(BaseModel):
    error: ErrorInnerMessage

class Symptoms(BaseModel):
    cough_intensity: int = None
    cough_type: str = None
    cough_color: str = None
    breathlessness: bool = None
    fatigued: bool = None
    limb_pain: int = None
    sniffles: bool = None
    sore_throat: int = None
    fever: float = None
    diarrhoea: bool = None

class Anamnesis(BaseModel):
    gender: str = None
    residence: int = None
    birthyear: int = None
    smoker: bool = None
    pregnant: bool = None
    positive_tested: bool = None
    infection_contact: str = None
    risk_area_stay: bool = None
    medication: str = None
    cardiovascular_desease: bool = None
    pulmonary_problems: bool = None
    chronic_liver_disease: bool = None
    diabetes_mellitus: bool = None
    cancer: bool = None
    immunodeficiency: bool = None
    miscellaneous: str = None

class Record(BaseModel):
    """Symptoms record for a specific date."""
    date: datetime.date
    symptoms: Symptoms

class User(BaseModel):
    username: str = Field(..., min_length=6, max_length=32)

class UserStored(User):
    password: str
    time_created: int
    usage_purpose: str

class UserLoginBody(BaseModel):
    username: str
    expires_in: int

class UserExists(BaseModel):
    exists: bool

class UsagePurpose(BaseModel):
    value: str
    label: str