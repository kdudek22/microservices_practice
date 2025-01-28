from flask import Flask, request, jsonify
import jwt, os
from datetime import datetime, timedelta, UTC
from flask_mysqldb import MySQL


server = Flask(__name__)
mysql = MySQL(server)

jwt_secret = "abcdef"

# config
server.config['MYSQL_DATABASE_USER'] = os.environ.get('MYSQL_DATABASE_USER')
server.config['MYSQL_DATABASE_HOST'] = os.environ.get('MYSQL_DATABASE_HOST')
server.config['MYSQL_DATABASE_PORT'] = os.environ.get('MYSQL_DATABASE_PORT')
server.config['MYSQL_DB'] = os.environ.get('MYSQL_DATABASE_DB')


@server.route("/validate", methods=["POST"])
def validate():
    encoded_jwt = request.headers.get('Authorization')

    if not encoded_jwt:
        return "Missing authorization header", 401

    token = encoded_jwt.split(" ")[1]

    try:
        decoded = jwt.decode(token, jwt_secret, algorithms=["HS256"])
    except:
        return "Failed to decode token", 401

    return decoded, 200

@server.route("/login", methods=["POST"])
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return "missing credentials", 401

    # check if the user exists in the db
    if not check_if_user_exists(auth.username, auth.password):
        return "invalid credentials", 403

    # if everything is fine, simply return a generated jwt token for the given user
    return jsonify({"token": generate_jwt(auth.username, True)}), 200


def generate_jwt(username: str, is_admin: bool) -> str:
    return jwt.encode(
        {
            "username": username,
            "exp": datetime.now(UTC) + timedelta(days=1),
            "iat": datetime.now(UTC),
            "is_admin": is_admin,
        },
        jwt_secret,
        algorithm="HS256"
    )

def check_if_user_exists(username: str, password: str) -> bool:
    cursor = mysql.connection.cursor()
    res = cursor.execute("SELECT email, password FROM users WHERE email = %s", (username,))

    if res == 0: # No user found
        return False

    row = cursor.fetchone()

    if password == row[1]: # password matches the one stored in the db
        return True

    return False


if __name__ == '__main__':
    server.run(host="0.0.0.0", port=5000, debug=True)
