from os import path, getcwd
import uuid
from datetime import datetime, timezone
from pydantic import BaseModel
import bcrypt
import jwt
import json
from models import UserStored
from db import UsersDb
from typing import Tuple
import errors

from firebase_admin import firestore

__location__ = path.realpath(path.join(getcwd(), path.dirname(__file__)))

AUTH_CONFIG: dict
with open(path.join(__location__, 'config.json'), 'r') as config_json:
    AUTH_CONFIG = json.load(config_json)

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_timestamp(delta: int = 0) -> int:
    return int(datetime.now().timestamp()) + delta

def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt())

def verify_pw(pw: str, hash: str) -> bool:
    hash_bytes: bytes
    try:
        hash_bytes = hash.encode('utf-8')
    except:
        hash_bytes = hash
    return bcrypt.checkpw(pw.encode('utf-8'), hash_bytes)

def get_purpose_id(name: str) -> str:
    queryResult = (firestore.client()
        .collection(u'usage_purposes')
        .where(u'purpose', u'==', name)
        .stream())
    try:
        ref = next(queryResult)
        return ref.id
    except:
        raise errors.PurposeIdException(f'{name} is not a valid purpose identifier')

def generate_access_token(user_id: str, user: UserStored) -> str:
    payload = {
        'iss': 'https://coronalog.de/auth',
        'sub': user_id,
        'iat': get_timestamp(),
        'exp': get_timestamp( AUTH_CONFIG['access_token']['lifetime'] ),
        'username': user.username,
        'roles': ['user']
    }
    access_token = jwt.encode(payload, AUTH_CONFIG['access_token']['secret'], algorithm=AUTH_CONFIG['access_token']['sign_alg'])
    return access_token

def validate_access_token(access_token: str, user_role: str = 'user') -> Tuple[str, UserStored]:
    payload = jwt.decode(access_token, AUTH_CONFIG['access_token']['secret'], algorithms=AUTH_CONFIG['access_token']['sign_alg'])
    if user_role not in payload['roles']:
        raise errors.UnverifiedRoleException('Required role not contained in jwt')

    user_id: str = payload['sub']
    try:
        user: UserStored = UsersDb.get_user_by_id(user_id)
        return user_id, user
    except LookupError:
        raise errors.UserNotExistsException(f'User with id {user_id} does not exist')

def generate_error_dict(status: int, key: str, message: str) -> dict:
    return {
        'error': {
            'code': status,
            'key': key,
            'message': message
        }
    }

def authenticate_user_by_cookies(cookies: dict) -> Tuple[str, UserStored]:
    if not AUTH_CONFIG['access_token']['body_cookie_key'] in cookies or not AUTH_CONFIG['access_token']['signature_cookie_key'] in cookies:
        raise errors.InvalidAuthCookiesException('Token could not be reconstructed')

    header_payload = cookies[AUTH_CONFIG['access_token']['body_cookie_key']]
    signature = cookies[AUTH_CONFIG['access_token']['signature_cookie_key']]

    user_id, user_stored = validate_access_token(
        '.'.join((header_payload, signature))
    )

    return user_id, user_stored