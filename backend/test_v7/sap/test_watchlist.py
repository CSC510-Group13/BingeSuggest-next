import sys
import unittest
import warnings
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position
from src.recommenderapp.utils import add_to_watchlist, create_account

# pylint: enable=wrong-import-position
warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for actor based recommender system
    """

    def setUp(self):
        print("\nrunning setup method")
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        executor.execute("SET FOREIGN_KEY_CHECKS=0;")
        executor.execute("DELETE FROM Users")
        executor.execute("DELETE FROM Ratings")
        executor.execute("DELETE FROM Friends")
        executor.execute("DELETE FROM Watchlist")
        db.commit()

    def test_add_function1(self):
        """
        Test case 1
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        executor = db.cursor()
        executor.execute("SELECT * FROM Users;")
        db_result = executor.fetchall()
        user_id = db_result[0][0]
        self.assertTrue(add_to_watchlist(db, user_id, "11"))

    def test_add_function2(self):
        """
        Test case 2
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        executor = db.cursor()
        executor.execute("SELECT * FROM Users;")
        db_result = executor.fetchall()
        user_id = db_result[0][0]
        add_to_watchlist(db, user_id, "11")
        self.assertFalse(add_to_watchlist(db, user_id, "11"))


if __name__ == "__main__":
    unittest.main()
