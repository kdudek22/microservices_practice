from functools import wraps
from pymongo import MongoClient
import gridfs, requests, os
from flask import Flask, request, jsonify
from flask_cors import CORS
from requests.auth import HTTPBasicAuth

server = Flask(__name__)
CORS(server)

MONGO_DB_USERNAME = os.getenv("MONGO_DB_USERNAME")
MONGO_DB_PASSWORD = os.getenv("MONGO_DB_PASSWORD")
MONGO_DB_HOST = os.getenv("MONGO_DB_HOST")

client = MongoClient(f"mongodb://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_DB_HOST}/test?authSource=admin")
db = client["test"]

fs = gridfs.GridFS(db)


def validate_jwt(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not "Authorization" in request.headers:
            return jsonify({"error": "Missing token"}), 400

        token = request.headers["Authorization"]

        if not token:
            return jsonify({"error": "Missing token"}), 400

        response = requests.post(f"http://localhost:5000/validate", headers={"Authorization": token})

        if response.status_code != 200:
            return jsonify({"error": "Failed to validate the token"}), 400
        return f(*args, **kwargs)
    return decorated


@server.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username, password = data.get('username', None), data.get('password', None)

    if not username or not password:
        return jsonify({"error": "username or password is required"}), 400

    response = requests.post(f"http://localhost:5000/login", auth=HTTPBasicAuth(username, password))

    if response.status_code != 200:
        return jsonify({"error": "Failed to log you in"}), 400

    return jsonify(response.json()), 200


@server.route('/encode', methods=['POST'])
@validate_jwt
def encode():
    file = request.files['file']
    try:
        fid = fs.put(file)
    except:
        return jsonify({"error": "Failed to upload file"}), 400

    return jsonify({"success": str(fid)}), 200


if __name__ == '__main__':
    server.run(host="0.0.0.0", port=5050, debug=True)
