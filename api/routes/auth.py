from fastapi import APIRouter, Body, status, Response
from fastapi.responses import JSONResponse
from db import UsersDb
from models import UserStored, UserLoginBody
from auth import functions as auth
from auth.functions import UserAlreadyExistsException

from firebase_admin import initialize_app

router = APIRouter()

@router.post('/signup', response_model=UserLoginBody)
def signup(
    response: Response,
    username: str = Body(...), 
    password: str = Body(..., min_length=8, max_length=64),
    usage_purpose: str = Body(...)
):
    try:
        user_exists, _ = UsersDb.username_exists(username)
        if user_exists:
            raise UserAlreadyExistsException(f'Bad request: {username} already exists.')

        new_user: UserStored = UserStored(
            username = username,
            password = auth.hash_pw(password),
            time_created = auth.get_timestamp(),
            usage_purpose=usage_purpose
        )
        user_id = auth.generate_uuid()

        access_token: str = auth.generate_access_token(user_id, new_user)
        header, payload, signature = access_token.decode().split('.')

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

        UsersDb.save_new_user(user_id, new_user)
        
        return UserLoginBody(
            username=username,
            expires_in=auth.AUTH_CONFIG['access_token']['lifetime']
        )

    except UserAlreadyExistsException as err:
        print(err)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST, 
            content=auth.generate_error_dict(
                status=status.HTTP_400_BAD_REQUEST,
                key='USER_EXISTS',
                message=f'{username} already exists.'
            )
        )
    except Exception as err:
        print(err)
        return JSONResponse(
            status_code=500,
            content=auth.generate_error_dict(
                status=500,
                key='SERVER_ERROR',
                message='Something went wrong'
            )
        )