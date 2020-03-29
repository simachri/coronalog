import os
from typing import List

import uvicorn
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from firebase_admin import initialize_app

from model.api import Record, Anamnesis
from model.db import RecordsDb, AnamnesesDb

app = FastAPI()
# Initialize Firestore DB
firebase_app = initialize_app()


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


@app.post('/api/anamneses', response_model=Anamnesis, status_code=200)
async def set_anamneses(anamnesis: Anamnesis):
    """Create or update the anamneses record for a specific user."""
    try:
        anamnesis = AnamnesesDb.set_anamnesis(anamnesis)
        return anamnesis
    except LookupError:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content={f"User '{anamnesis.username}' is not yet registered in the database."})


# @main.get('/users')
# async def get_all_users():
#     users = UsersDb.get_all_users()
#     if users is []:
#         return "Not found.", 404
#     else:
#         return jsonify(users), 200
#
# @main.get('/check')
# async def check_if_users_exist():
#     user = request.args.get('user')
#     if UsersDb.check_if_user_exists(user):
#         return "User exists", 200
#     return jsonify(UsersDb.get), 404
#
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
