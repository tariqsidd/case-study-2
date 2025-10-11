from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
import os

# Import StudentQuery
if __name__ == '__main__':
    from student_api import StudentQuery
else:
    from .student_api import StudentQuery

app = Flask(__name__)

# Configure CORS with explicit settings
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(app, 
     resources={
         r"/*": {
             "origins": "*",
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization", "Accept"],
             "supports_credentials": True
         }
     })

# Add CORS headers to every response
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response


@app.route('/students', methods=['GET'])
def get_students():
    student_query = StudentQuery()
    return jsonify(student_query.get_all())


@app.route('/student/<uuid>', methods=['GET'])
def get_student(uuid):
    student_query = StudentQuery()
    return jsonify(student_query.get_by_uuid(uuid))


@app.route('/student', methods=['POST'])
def create_student():
    student_data = request.json
    student_query = StudentQuery()
    uuid = student_query.create_student(student_data)
    return jsonify({'uuid': uuid})


@app.route('/student/<uuid>', methods=['DELETE'])
def delete_student(uuid):
    student_query = StudentQuery()
    result = student_query.delete_student(uuid)
    return jsonify({'success': result})


@app.route('/student/<uuid>', methods=['PUT'])
def update_student(uuid):
    student_data = request.json
    student_query = StudentQuery()
    result = student_query.update_student(uuid, student_data)
    return jsonify({'success': result})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
