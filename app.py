from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Simulated user database
users = {"admin": "password123"}  

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"status": "error", "message": "Missing username or password"}), 400

    if username in users:
        return jsonify({"status": "error", "message": "Username already exists"}), 400

    users[username] = password  # Save the user
    return jsonify({"status": "success", "message": "User created successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if users.get(username) == password:
        return jsonify({"status": "success", "message": "Login successful"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

if __name__ == '__main__':
    app.run(debug=True)
