import sqlite3
import os

FIELD_ORDER = ("class", "name", "sex", "age", "siblings", "gpa")


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


class StudentQuery(object):

    def __init__(self, db_name="./students.db"):
        self._db_name = db_name

        if not os.path.exists(db_name):
            open(db_name, "w+")
        self.db_connection = sqlite3.connect(self._db_name)
        with self.db_connection as conn:
            cursor = conn.cursor()
            cursor.execute("""
                            CREATE TABLE IF NOT EXISTS "students" (
                                                                   "name"	TEXT NOT NULL UNIQUE,
                                                                   "age"	INTEGER NOT NULL,
                                                                   "sex"	TEXT NOT NULL,
                                                                   "siblings"	INTEGER NOT NULL,
                                                                   "gpa"	NUMERIC NOT NULL,
                                                                   "uuid"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
                                                                   "class"	INTEGER NOT NULL
                                                                  );
                           """)

    def get_all(self):
        with self.db_connection as conn:
            cursor = conn.cursor()
            cursor.row_factory = dict_factory
            cursor.execute("""
                               SELECT * FROM students
                           """)
            return cursor.fetchall()

    def get_by_uuid(self, uuid):
        with self.db_connection as conn:
            cursor = conn.cursor()
            cursor.row_factory = dict_factory
            cursor.execute("""
                               SELECT * FROM students WHERE uuid = ?
                           """,
                           (uuid,))
            return cursor.fetchone()

    def create_student(self, data):
        with self.db_connection as conn:
            cursor = conn.cursor()
            query = ''' 
                        INSERT INTO students({})
                        VALUES(?,?,?,?,?,?) 
                    '''.format(', '.join(FIELD_ORDER))
            task = tuple([data[field] for field in FIELD_ORDER])
            cursor.execute(query, task)
            return cursor.lastrowid

    def delete_student(self, uuid):
        with self.db_connection as conn:
            cursor = conn.cursor()
            query = ''' 
                        DELETE FROM students
                        WHERE uuid = ?
                    '''
            cursor.execute(query, (uuid,))
            if cursor.rowcount:
                return True
            else:
                return False

    def update_student(self, uuid, data):
        with self.db_connection as conn:
            cursor = conn.cursor()
            query = ''' 
                        UPDATE students
                        SET {fields}
                        WHERE uuid = ?
                    '''.format(fields='=?, '.join(FIELD_ORDER) + '=?')

            task = tuple([data[field] for field in FIELD_ORDER] + [uuid] )

            cursor.execute(query, task)

            if cursor.rowcount:
                return True
            else:
                return False
