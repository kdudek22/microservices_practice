from functools import wraps
from io import BytesIO
from threading import Thread

from pymongo import MongoClient
import gridfs, requests, os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from requests.auth import HTTPBasicAuth
import pika, logging

logger = logging.getLogger(__name__)

FILES_TO_PROCESS_QUE_NAME = "files_to_process"
PROCESSED_FILES_QUE_NAME = "processed_files"

server = Flask(__name__)
CORS(server)

MONGO_DB_USERNAME = os.getenv("MONGO_DB_USERNAME")
MONGO_DB_PASSWORD = os.getenv("MONGO_DB_PASSWORD")
MONGO_DB_HOST = os.getenv("MONGO_DB_HOST")
client = MongoClient(f"mongodb://{MONGO_DB_USERNAME}:{MONGO_DB_PASSWORD}@{MONGO_DB_HOST}/test?authSource=admin")
fs = gridfs.GridFS(client["test"])

connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
channel = connection.channel()

def callback(ch, method, properties, body):
    body = body.decode()
    print(f"Received {body}")

receive_connection = pika.BlockingConnection(pika.ConnectionParameters("localhost"))
receive_channel = receive_connection.channel()

receive_channel.basic_consume(queue=PROCESSED_FILES_QUE_NAME, auto_ack=True, on_message_callback=callback)


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
    if file.mimetype != 'image/jpeg':
        return jsonify({"error": "Invalid file format, the file must be a jpg file"}), 400

    try:
        fid = fs.put(file)
        print(f"Created file {fid}, sending message to {FILES_TO_PROCESS_QUE_NAME}")
        channel.basic_publish(exchange='', routing_key=FILES_TO_PROCESS_QUE_NAME, body=str(fid))
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return jsonify({"success": str(fid)}), 200

@server.route('/image', methods=['GET'])
# @validate_jwt
def image():
    file_id = request.args.get('image_id')

    try:
        file = fs.get(file_id)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    return send_file(BytesIO(file.read()), mimetype='application/octet-stream', as_attachment=True, download_name=f"{file_id}.jpg")

if __name__ == '__main__':
    Thread(target=receive_channel.start_consuming).start()
    server.run(host="0.0.0.0", port=5050, debug=True)
