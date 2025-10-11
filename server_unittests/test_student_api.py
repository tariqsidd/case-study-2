import unittest
from server.student_api import StudentQuery, FIELD_ORDER
from server_unittests.test_server import test_data


def pop_uuid(row):
    row.pop("uuid")
    return row


class StudentQueryTest(unittest.TestCase):

    def setUp(self):
        # setup db and load testdata
        self.studentQuery = StudentQuery(db_name=":memory:")
        with self.studentQuery.db_connection as conn:
            cursor = conn.cursor()
            query = ''' 
                        INSERT INTO students({})
                        VALUES(?,?,?,?,?,?) 
                    '''.format(', '.join(FIELD_ORDER))
            for row in test_data:
                task = tuple([row[field] for field in FIELD_ORDER])
                cursor.execute(query, task)

    def test_get_all(self):
        data = self.studentQuery.get_all()
        data = list(map(pop_uuid, data))

        self.assertEqual(len(test_data), len(data))
        self.assertEqual(test_data, data)

    def test_get_by_uuid(self):
        uuid = 1
        student = self.studentQuery.get_by_uuid(uuid)
        self.assertEqual(student['uuid'], uuid)

    def test_create_student(self):
        new_student = {"name": "Phoebe Mo", "sex": "female", "age": 25, "siblings": 1, "class": 1, "gpa": 8.}
        uuid = self.studentQuery.create_student(new_student)
        student = self.studentQuery.get_by_uuid(uuid)
        student = pop_uuid(student)
        self.assertEqual(new_student, student)

    def test_delete_student(self):
        students = self.studentQuery.get_all()
        student = students[0]
        self.studentQuery.delete_student(student['uuid'])
        updated_students = self.studentQuery.get_all()
        students.remove(student)
        self.assertEqual(updated_students, students)

    def test_update_student(self):
        students = self.studentQuery.get_all()
        student = students[0]
        original_student = student.copy()
        new_name = "Charlie Chaplin"
        student['name'] = new_name
        self.studentQuery.update_student(student['uuid'], student)
        updated_student = self.studentQuery.get_by_uuid(student['uuid'])
        original_student['name'] = new_name
        self.assertEqual(original_student, updated_student)
