from typing import List, Dict, Any

from firebase_admin import initialize_app
from flask import Blueprint, request, jsonify, render_template, redirect

from model import registrations
from model.anamneses import Anamnese
from model.db import RecordsDb, AnamnesesDb, firestore_client, get_timestamp, RegistrationDb, UsersDb
from model.records import Record

# Initialize Flask app
# url_prefix 'api' is used to make the server clearly identify API calls by their specific URL.
main = Blueprint('app', __name__, url_prefix="/api")

# Initialize Firestore DB
firebase_app = initialize_app()

todo_ref = firestore_client().collection('todos')


@main.route('/records', methods=['GET'])
def get_records():
    """Read all records for a given user provide by URL parameter 'user'

    :return: All medical records for the given user.
    """
    username = request.args.get('user', '', type=str)
    if username == '':
        return "Not found.", 404
    records = RecordsDb.get(username)
    if records is []:
        return "Not found.", 404
    result: List[Dict[Any, Any]] = []
    for record in records:
        result.append({
            'user': username,
            'date': record.date,
            'symptoms': record.get_symptoms()
        })
    return jsonify(result), 200

@main.route('/users', methods=['GET'])
def get_all_users():
    users = UsersDb.get_all_users()
    if users is []:
        return "Not found.", 404
    else:
        return jsonify(users), 200

@main.route('/check', methods=['GET'])
def check_if_users_exist():
    user = request.args.get('user')
    if UsersDb.check_if_user_exists(user):
        return "User exists", 200
    return jsonify(UsersDb.get), 404

@main.route('/records', methods=['POST'])
def set_record():
    """Create or update a new daily medical record

    """
    try:
        user = request.json["user"]
        date = request.json["date"]
        record = Record(from_json=request.json["symptoms"])
        doc_attr = RecordsDb.set_record(user, date, record)
        return jsonify(doc_attr), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@main.route('/anamneses', methods=['POST'])
def create_anamneses():
    if request.method == 'POST':
        """Create or update the anamneses record for the specified user."""
        try:
            user = request.json["user"]
            anamnese: Anamnese = Anamnese(from_json=request.json["characteristics"])
            # anamnese.enhance_values(AnamnesesDb.get(user))
            doc_attr = AnamnesesDb.set_anamnesis(user, anamnese)
            return jsonify(doc_attr), 200
        except Exception as e:
            return f"An Error Occured: {e}", 500
    else:
        return jsonify(AnamnesesDb.get(request.args.get('user'))), 200

@main.route('/anamneses', methods=['GET'])
def get_anamneses_by_user():
    """Returns the anamnese of a given user"""
    user = request.args.get('user')
    anamnese = AnamnesesDb.get(user)
    if anamnese is None:
        return "Not found.", 404
    else:
        return jsonify(anamnese), 200

@main.route('/registrations', methods=['GET', 'POST'])
def create_registration():
    if request.method == 'POST':
        """Create new registration. The UUID is calculated by the server."""
        # Try/except is currently not required as it is impossible to raise a 'Conflict'
        # exception as the UUID is calculated by the server.
        doc_attr = RegistrationDb.create(registrations.Registration(request.json))
        return jsonify(doc_attr), 200
    else:
        tasks = [todo_item.get().to_dict() for todo_item in todo_ref.list_documents(page_size=50)]
        return jsonify(tasks), 200


@main.route('/', methods=['GET', 'POST'])
def home():
    if request.method == 'POST':
        return create_new_task()
    else:
        tasks = [todo_item.get().to_dict() for todo_item in todo_ref.list_documents(page_size=50)]
        return render_template('index.html', tasks=tasks)


def create_new_task():
    task_content = request.form['content']
    todo_ref.add({'task': task_content,
                  'created_at': get_timestamp()})
    return redirect('/')


@main.route('/add', methods=['POST'])
def create():
    """
        create() : Add document to Firestore collection with request body.
        Ensure you pass a custom ID as part of json body in post request,
        e.g. json={'req_id': '1', 'title': 'Write a blog post'}
    """
    try:
        req_id = request.json['req_id']
        todo_ref.document(req_id).set(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@main.route('/list', methods=['GET'])
def read():
    """
        read() : Fetches documents from Firestore collection as JSON.
        todo : Return document that matches query ID.
        all_todos : Return all documents.
    """
    try:
        # Check if ID was passed to URL query
        todo_id = request.args.get('id')
        if todo_id:
            todo = todo_ref.document(todo_id).get()
            return jsonify(todo.to_dict()), 200
        else:
            all_todos = [doc.to_dict() for doc in todo_ref.stream()]
            return jsonify(all_todos), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@main.route('/update', methods=['POST', 'PUT'])
def update():
    """
        update() : Update document in Firestore collection with request body.
        Ensure you pass a custom ID as part of json body in post request,
        e.g. json={'req_id': '1', 'title': 'Write a blog post today'}
    """
    try:
        req_id = request.json['req_id']
        todo_ref.document(req_id).update(request.json)
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"


@main.route('/delete', methods=['GET', 'DELETE'])
def delete():
    """
        delete() : Delete a document from Firestore collection.
    """
    try:
        # Check for ID in URL query
        todo_id = request.args.get('id')
        todo_ref.document(todo_id).delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return f"An Error Occured: {e}"
