import os
from typing import List

import uvicorn
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from firebase_admin import initialize_app
from pydantic.main import BaseModel

from model.api import Record, Anamnesis, User
from model.db import RecordsDb, AnamnesesDb, UsersDb

app = FastAPI()
# Initialize Firestore DB
firebase_app = initialize_app()


class ReturnMessage(BaseModel):
    message: str


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


@app.post('/api/anamneses', response_model=Anamnesis, status_code=200, responses={404: {"model": ReturnMessage}})
async def set_anamneses(anamnesis: Anamnesis):
    """Create or update the anamneses record for a specific user."""
    try:
        anamnesis = AnamnesesDb.set_anamnesis(anamnesis)
        return anamnesis
    except LookupError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={"message": f"User '{anamnesis.username}' is not yet created."})


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


# @main.post('/records')
# async def set_record():
#     """Create or update a new daily medical record"""
#     try:
#         user = request.json["user"]
#         date = request.json["date"]
#         record = Record(from_json=request.json["symptoms"])
#         doc_attr = RecordsDb.set_record(user, date, record)
#         return jsonify(doc_attr), 200
#     except Exception as e:
#         return f"An Error Occured: {e}"
#
#
#
# @main.get('/anamneses')
# async def get_anamneses_by_user():
#     """Returns the anamnese of a given user"""
#     user = request.args.get('user')
#     anamnese = AnamnesesDb.get(user)
#     if anamnese is None:
#         return "Not found.", 404
#     else:
#         return jsonify(anamnese), 200
#

port = os.environ['PORT']
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=port)
