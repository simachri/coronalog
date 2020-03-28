import uvicorn
from typing import List

from fastapi import FastAPI, APIRouter, status
from fastapi.responses import JSONResponse
from firebase_admin import initialize_app

from model.api import Record
from model.db import RecordsDb

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
# @main.post('/anamneses')
# async def create_anamneses():
#     """Create or update the anamneses record for the specified user."""
#     try:
#         user = request.json["user"]
#         anamnese: Anamnese = Anamnese(from_json=request.json["characteristics"])
#         # anamnese.enhance_values(AnamnesesDb.get(user))
#         doc_attr = AnamnesesDb.set_anamnesis(user, anamnese)
#         return jsonify(doc_attr), 200
#     except Exception as e:
#         return f"An Error Occured: {e}", 500
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

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
