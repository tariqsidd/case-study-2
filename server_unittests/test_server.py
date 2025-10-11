import unittest
import json
from unittest.mock import patch
from server.server import *

test_data = [{"name": "Thomas Smith", "sex": "male", "age": 27, "siblings": 2, "class": 2, "gpa": 10.},
             {"name": "Steven Alton", "sex": "male", "age": 26, "siblings": 1, "class": 2, "gpa": 5.4}]


class ServerTests(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['WTF_CSRF_ENABLED'] = False
        app.config['DEBUG'] = False
        self.app = app.test_client()

    @patch("server.student_api.sqlite3")
    @patch("server.student_api.StudentQuery.get_all", return_value=test_data)
    def test_getStudents(self, studentQueryPatch, sqlPatch):
        response = self.app.get('/students')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, test_data)

    @patch("server.student_api.sqlite3")
    @patch("server.student_api.StudentQuery.get_by_uuid", return_value=test_data[0])
    def test_getStudent(self, studentQueryPatch, sqlPatch):
        response = self.app.get('/student/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, test_data[0])

    @patch("server.student_api.sqlite3")
    @patch("server.student_api.StudentQuery.create_student", return_value=1)
    def test_createStudent(self, studentQueryPatch, sqlPatch):
        response = self.app.post('/student', data=json.dumps(test_data[0]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['uuid'], 1)

    @patch("server.student_api.sqlite3")
    @patch("server.student_api.StudentQuery.delete_student", return_value=True)
    def test_deleteStudent(self, studentQueryPatch, sqlPatch):
        response = self.app.delete('/student/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['success'], True)

    @patch("server.student_api.sqlite3")
    @patch("server.student_api.StudentQuery.update_student", return_value=True)
    def test_updateStudent(self, studentQueryPatch, sqlPatch):
        response = self.app.put('/student/1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['success'], True)
