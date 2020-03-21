from flask import Flask


def create_app():
    flask_app: Flask = Flask(__name__)
    from .app import main
    flask_app.register_blueprint(main)
    return flask_app
