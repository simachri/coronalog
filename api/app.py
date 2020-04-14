import os
from typing import List, Tuple

import uvicorn
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from firebase_admin import initialize_app
from google.cloud.firestore_v1 import DocumentReference
from pydantic.main import BaseModel

from model.models import Record, Anamnesis, User, UserExists
from model.db import RecordsDb, AnamnesesDb, UsersDb

app = FastAPI()
# Initialize Firestore DB
firebase_app = initialize_app()


class ReturnMessage(BaseModel):
    message: str

@app.get('/api/check', response_model=UserExists, status_code=200)
async def get_check(username: str):
    exists, ref = UsersDb.exists(username)
    return UserExists(exists=exists)

@app.get('/api/records', response_model=List[Record], status_code=200)
async def get_records(username: str):
    """Read all records for a given user provide by URL parameter 'user'

    :return: All medical records for the given user.
    """
    if username == '':
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content={"Username must not be empty."})
    records = RecordsDb.get(username)
    if records is []:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={f"No records exist for username {username}."})
    return records


@app.get('/api/users', response_model=List[User], status_code=200, responses={404: {"model": ReturnMessage}})
async def get_users(username: str = None):
    """Get user record.
    :param username: Optional - if a username is provided the record for that user will be returned.
    :return: Userrecord and status code 200 if at least one user is found.
             Status code 400 if nothing is found or the requested user does not exist.
    """
    if username is not None:
        try:
            return [UsersDb.get(username)]
        except LookupError:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                                content={"message": f"User '{username}' is not yet created."})
    else:
        return UsersDb.get_all()


@app.post('/api/records', response_model=Record, status_code=200, responses={404: {"model": ReturnMessage}})
async def set_record(user: User, record: Record):
    """Create or update a new daily medical record

    :return: The updated daily medical record.
             Status code 400 if the requested user does not exist.
    """
    try:
        return RecordsDb.set_record(user, record)
    except LookupError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"message": f"User '{user.username}' is not yet created."})


@app.get('/api/anamneses', response_model=Anamnesis, status_code=200, responses={404: {"model": ReturnMessage}})
async def get_anamneses(username: str):
    """Get the anamnesis data for a user."""
    try:
        return AnamnesesDb.get(username)
    except LookupError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"message": f"User {username} does not exist."})


@app.post('/api/anamneses', response_model=Anamnesis, status_code=200)
async def set_anamneses(user: User, anamnesis_data: Anamnesis):
    """Create or update the anamneses record for a specific user."""
    anamnesis = AnamnesesDb.set_anamnesis(user.username, anamnesis_data)
    return anamnesis


port = os.environ['PORT']
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=port)
