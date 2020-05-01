from typing import Sequence, List

from fastapi import APIRouter, Body, status, Response, Request
from fastapi.responses import JSONResponse
from db import UsersDb, UsagePurposesDb
from models import UserStored, UserLoginBody, UsagePurpose, ErrorMessage
from auth import functions as auth
import errors

from firebase_admin import initialize_app

router = APIRouter()

@router.post('/signup', response_model=UserLoginBody, responses={
    400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}
})
def signup(
    requst: Request,
    response: Response,
    username: str = Body(...), 
    password: str = Body(..., min_length=8, max_length=64),
    usage_purpose: str = Body(...)
):
    try:
        return do_signup_logic(response, username, password, usage_purpose)

    except errors.UserAlreadyExistsException as err:
        print(err)
        return errors.USER_EXISTS_RES(username)
    except errors.InvalidUsagePurposeException as err:
        print(err)
        return errors.INVALID_PURPOSE_ID_RES(usage_purpose)
    except Exception as err:
        print(err)
        return errors.SERVER_ERROR()

@router.post('/signin', response_model=UserLoginBody, responses={
    400: {"model": ErrorMessage}, 500: {"model": ErrorMessage}
})
def signin(
    response: Response,
    username: str = Body(...),
    password: str = Body(...)
):
    try:
        return do_signin_logic(response, username, password)

    except LookupError as err: # username does not exist
        print(err)
        return errors.USER_NOT_FOUND_RES(username)
    except errors.InvalidPasswordException as err: # wrong password
        print(err)
        return errors.WRONG_PASSWORD_RES()
    except Exception as err:
        print(err)
        return errors.SERVER_ERROR()

@router.get('/logout')
def logout(
    res: Response
):
    res.delete_cookie(auth.AUTH_CONFIG['access_token']['body_cookie_key'])
    res.delete_cookie(auth.AUTH_CONFIG['access_token']['signature_cookie_key'])
    
    return {}

@router.get('/vendors', response_model=List[UsagePurpose])
def get_vendors():
    return UsagePurposesDb.get_all()


def do_signin_logic(
    response: Response,
    username: str,
    password: str
) -> UserLoginBody:

    # check if user exists
    user_id, user = UsersDb.get_user_by_username(username)

    # check password
    if not auth.verify_pw(password, user.password):
        raise errors.InvalidPasswordException('The entered password is invalid.')

    # issue token
    generate_and_set_access_token(response, user_id, user)

    return UserLoginBody(
        username=username,
        expires_in=auth.AUTH_CONFIG['access_token']['lifetime']
    )
    
def do_signup_logic(
    response: Response,
    username: str,
    password: str,
    usage_purpose: str
) -> UserLoginBody:

    # check if valid usage_purpose was submitted
    all_purps: Sequence = UsagePurposesDb.get_all()
    valid_purpose = False
    for purp_ref in all_purps:
        if purp_ref.get().id == usage_purpose:
            valid_purpose = True
            break
    if not valid_purpose:
        raise errors.InvalidUsagePurposeException(f'Usage purpose id {usage_purpose} is invalid')

    # check if user already exists
    user_exists, _ = UsersDb.username_exists(username)
    if user_exists:
        raise errors.UserAlreadyExistsException(f'Bad request: {username} already exists.')

    # create new user
    new_user: UserStored = UserStored(
        username = username,
        password = auth.hash_pw(password),
        time_created = auth.get_timestamp(),
        usage_purpose=usage_purpose
    )
    user_id = auth.generate_uuid()

    # create access token
    generate_and_set_access_token(response, user_id, new_user)

    # save newly created user only if all steps up until now were successful
    UsersDb.save_new_user(user_id, new_user)
    
    return UserLoginBody(
        username=username,
        expires_in=auth.AUTH_CONFIG['access_token']['lifetime']
    )

def generate_and_set_access_token(response: Response, user_id: str, user: UserStored) -> None:
    access_token: str = auth.generate_access_token(user_id, user)
    header, payload, signature = access_token.decode().split('.')

    # set token in cookies
    response.set_cookie(
        key=auth.AUTH_CONFIG['access_token']['body_cookie_key'],
        value='.'.join((header, payload)),
        secure=True,
        # samesite='strict' !!! not supported by fastapi at the moment. Dependent on lower starlette version
    )
    response.set_cookie(
        key=auth.AUTH_CONFIG['access_token']['signature_cookie_key'],
        value=signature,
        secure=True,
        httponly=True,
        # samesite='strict'
    )

    #set samesite flag manually
    for idx, header in enumerate(response.raw_headers):
        if header[0].decode('utf-8') == 'set-cookie':
            cookie: str = header[1].decode('utf-8')
            if cookie.startswith(auth.AUTH_CONFIG['access_token']['body_cookie_key']) or cookie.startswith(auth.AUTH_CONFIG['access_token']['signature_cookie_key']):
                cookie = cookie + '; SameSite=Strict'
                response.raw_headers[idx] = (header[0], cookie.encode())