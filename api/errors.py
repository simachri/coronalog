from fastapi.responses import JSONResponse
from fastapi import status
from auth import functions as fct
import model.db as db

class ClogException(Exception):
    pass

class PurposeIdException(ClogException):
    pass
class UnverifiedRoleException(ClogException):
    pass
class UserNotExistsException(ClogException):
    pass
class UserAlreadyExistsException(ClogException):
    pass
class InvalidPasswordException(ClogException):
    pass
class InvalidAuthCookiesException(ClogException):
    pass
class InvalidUsagePurposeException(ClogException):
    pass
class InvalidDateFormatException(ClogException):
    pass


SERVER_ERROR = 'SERVER_ERROR'
def server_error_response():
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
        content=fct.generate_error_dict(
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            key=SERVER_ERROR,
            message='Something went wrong'
        )
    )
SERVER_ERROR_RES = server_error_response

NO_PERMISSION = 'NO_PERMISSION'
def no_permission_response():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=NO_PERMISSION,
            message='User has no permission to access this action.'
        )
    )
NO_PERMISSION_RES = no_permission_response

NOT_AUTHENTICATED = 'NOT_AUTHENTICATED'
def not_authenticated_response():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=NOT_AUTHENTICATED,
            message='Request requires valid authentication access token.'
        )
    )
NOT_AUTHENTICATED_RES = not_authenticated_response

USER_EXISTS = 'USER_EXISTS'
def user_exists_response(username: str):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=USER_EXISTS,
            message=f'{username} username already exists.'
        )
    )
USER_EXISTS_RES = user_exists_response

INVALID_PURPOSE_ID = 'INVALID_PURPOSE_ID'
def invalid_purpose_id_response(usage_purpose: str):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=INVALID_PURPOSE_ID,
            message=f'{usage_purpose} is invalid.'
        )
    )
INVALID_PURPOSE_ID_RES = invalid_purpose_id_response

USER_NOT_FOUND = 'USER_NOT_FOUND'
def user_not_found_response(username: str):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=USER_NOT_FOUND,
            message=f'{username} does not exist'
        )
    )
USER_NOT_FOUND_RES = user_not_found_response

WRONG_PASSWORD = 'WRONG_PASSWORD'
def wrong_password_response():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=WRONG_PASSWORD,
            message='The password is invalid'
        )
    )
WRONG_PASSWORD_RES = wrong_password_response

INVALID_TOKEN = 'INVALID_TOKEN'
def invalid_token_res():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=INVALID_TOKEN,
            message='The submitted token could not be validated'
        )
    )
INVALID_TOKEN_RES = invalid_token_res

NO_RECORD_FOUND = 'NO_RECORD_FOUND'
def no_record_found_res():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=NO_RECORD_FOUND,
            message='No record is available for this date'
        )
    )
NO_RECORD_FOUND_RES = no_record_found_res

MALFORMED_DATE = 'MALFORMED_DATE'
def malformed_date_res():
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST, 
        content=fct.generate_error_dict(
            status=status.HTTP_400_BAD_REQUEST,
            key=MALFORMED_DATE,
            message=f'Date format should be {db.DATE_FORMAT}'
        )
    )
MALFORMED_DATE_RES = malformed_date_res