from typing import List, Tuple

from fastapi import APIRouter, status, Request, Body
from fastapi.responses import JSONResponse
from google.cloud.firestore_v1 import DocumentReference
from pydantic.main import BaseModel

from model.models import ErrorMessage, Record, Anamnesis, User, UserExists
from model.db import RecordsDb, AnamnesisDb, UsersDb, is_correct_format
import errors

router = APIRouter()


@router.get('/check', response_model=UserExists, status_code=200)
async def get_check(username: str):
    exists, ref = UsersDb.username_exists(username)
    return UserExists(exists=exists)

@router.get('/records', response_model=List[Record], status_code=200)
async def get_records(req: Request):
    """Read all records for a given user. User id and name are extracted from the provided token.

    :return: All medical records for the given user.
    """
    if not req.state.username or not req.state.user_id:
        return errors.INVALID_TOKEN_RES()
    records = RecordsDb.get_by_user_id(req.state.user_id)
    return records

@router.get('/record', response_model=Record, status_code=200)
async def get_record(req: Request, date: str):
    if not req.state.username or not req.state.user_id:
        return errors.INVALID_TOKEN_RES()
    if not is_correct_format(date):
        return errors.MALFORMED_DATE_RES()
    try:
        record = RecordsDb.get_one_by_user_id_and_date_str(req.state.user_id, date)
        return record
    except LookupError as err:
        print(err)
        return errors.NO_RECORD_FOUND_RES()

# @router.get('/users', response_model=List[User], status_code=200, responses={404: {"model": ReturnMessage}})
# async def get_users(username: str = None):
#     """Get user record.
#     :param username: Optional - if a username is provided the record for that user will be returned.
#     :return: Userrecord and status code 200 if at least one user is found.
#              Status code 400 if nothing is found or the requested user does not exist.
#     """
#     if username is not None:
#         try:
#             return [UsersDb.get(username)]
#         except LookupError:
#             return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
#                                 content={"message": f"User '{username}' is not yet created."})
#     else:
#         return UsersDb.get_all()


@router.post('/record', response_model=Record, status_code=200, responses={500: {"model": ErrorMessage}})
async def set_record(req: Request, record: Record):
    """Create or update a new daily medical record

    :return: The updated daily medical record.
             Status code 500 if the requested user does not exist (should never be the case when this is called).
    """
    if not req.state.username or not req.state.user_id:
        return errors.INVALID_TOKEN_RES()
    try:
        return RecordsDb.set_record(req.state.user_id, record)
    except LookupError:
        return errors.SERVER_ERROR_RES()


@router.get('/anamnesis', response_model=Anamnesis, status_code=200, responses={500: {"model": ErrorMessage}})
async def get_anamnesis(req: Request):
    """Get the anamnesis data for a user."""
    if not req.state.username or not req.state.user_id:
        return errors.INVALID_TOKEN_RES()
    try:
        return AnamnesisDb.get_by_user_id(req.state.user_id)
    except LookupError:
        return errors.SERVER_ERROR_RES()


@router.post('/anamnesis', response_model=Anamnesis, status_code=200)
async def set_anamnesis(req: Request, anamnesis_data: Anamnesis = Body(..., embed=True)):
    """Create or update the anamnesis record for a specific user."""
    if not req.state.username or not req.state.user_id:
        return errors.INVALID_TOKEN_RES()
    anamnesis = AnamnesisDb.set_anamnesis(req.state.user_id, anamnesis_data)
    return anamnesis