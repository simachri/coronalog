from firebase_admin import initialize_app
from flask import Blueprint, request, jsonify, render_template, redirect

from model.db import RecordsDb, AnamnesesDb, firestore_client, get_timestamp, RegistrationDb
from model import registrations
from model.records import Record
from model.anamneses import Anamnese

# Initialize Flask app
main = Blueprint('app', __name__)

# Initialize Firestore DB
firebase_app = initialize_app()

todo_ref = firestore_client().collection('todos')


@main.route('/records', methods=['GET'])
def get_records():
    """Read all records for a given user provide by URL parameter 'user'

    :return: All medical records for the given user.
    """
    records = RecordsDb.get(request.args.get('user'))
    return jsonify(records), 200


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


@main.route('/anamneses', methods=['GET', 'POST'])
def create_anamneses():
    if request.method == 'POST':
        """Create or update the anamneses record for the specified user."""
        try:
            user = request.json["user"]
            anamnese: Anamnese = Anamnese(from_json=request.json["characteristics"])
            anamnese.enhance_values(AnamnesesDb.get(user))
            doc_attr = AnamnesesDb.set_anamnesis(user, anamnese)
            return jsonify(doc_attr), 200
        except Exception as e:
            return f"An Error Occured: {e}", 500
    else:
        return jsonify(AnamnesesDb.get(request.args.get('user'))), 200


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
