"""
Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks
"""

import sys
import unittest
import warnings
import os
import bcrypt
import flask
from dotenv import load_dotenv
from pathlib import Path
import mysql.connector
import pandas as pd

sys.path.append(str(Path(__file__).resolve().parents[2]))

from src.recommenderapp.utils import (
    create_account,
    login_to_account,
    get_wall_posts,
    get_username,
    get_recent_movies,
    add_friend,
    get_friends,
    submit_review,
    get_recent_friend_movies,
)

warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for DB
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
        db.commit()

    def test_accounts(self):
        """
        Test case 1
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        expected_username = "someUser"
        expected_email = "abc@test.com"
        expected_password = ("Pass").encode("utf-8")
        executor = db.cursor()
        executor.execute("SELECT * FROM Users;")
        db_result = executor.fetchall()
        actual_password = (db_result[0][3]).encode("utf-8")
        self.assertTrue(len(db_result) > 0)
        self.assertEqual(expected_username, db_result[0][1])
        self.assertEqual(expected_email, db_result[0][2])
        self.assertTrue(bcrypt.checkpw(expected_password, actual_password))
        fail = login_to_account(db, "someUser", "wrong")
        self.assertIsNone(fail)
        db.close()

    def test_get_wall_posts(self):
        """
        Test case 2
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        executor.execute("SET FOREIGN_KEY_CHECKS=0;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        executor.execute("SELECT idUsers FROM Users WHERE username='someUser'")
        db_result = executor.fetchall()
        user = db_result[0][0]
        executor.execute(
            "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                         VALUES (%s, %s, %s, %s, %s);",
            (int(user), int(11), int(4), "this is a great movie", "2024-10-11"),
        )
        db.commit()
        app = flask.Flask(__name__)
        a = ""
        with app.test_request_context("/"):
            a = get_wall_posts(db)
        self.assertEqual(a.json[0]["imdb_id"], "tt0076759")
        self.assertEqual(a.json[0]["name"], "Star Wars (1977)")
        self.assertEqual(a.json[0]["review"], "this is a great movie")
        self.assertEqual(a.json[0]["score"], 4)

    def test_get_username(self):
        """
        Test case 3
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        user = login_to_account(db, "someUser", "Pass")
        app = flask.Flask(__name__)
        username = ""
        with app.test_request_context("/"):
            username = get_username(db, user).json
        self.assertEqual("someUser", username)

    def test_get_recent_movies(self):
        """
        Test case 4
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        user = login_to_account(db, "someUser", "Pass")

        movies_to_review = [
            (2, 3, "2024-10-06"),
            (3, 4, "2024-10-05"),
            (5, 5, "2024-10-04"),
            (6, 2, "2024-10-03"),
            (11, 1, "2024-10-02"),
            (12, 3, "2024-10-01"),
        ]
        for movie in movies_to_review:
            executor.execute(
                "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                             VALUES (%s, %s, %s, %s, %s);",
                (
                    int(user),
                    int(movie[0]),
                    int(movie[1]),
                    "this is a great movie",
                    movie[2],
                ),
            )
        db.commit()
        app = flask.Flask(__name__)
        recent_movies = []
        with app.test_request_context("/"):
            recent_movies = get_recent_movies(db, user)
        self.assertEqual(5, len(recent_movies.json))
        for i, movie in enumerate(recent_movies.json):
            self.assertEqual(movie["score"], movies_to_review[i][1])

    def test_friends(self):
        """
        Test case 5
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        user = login_to_account(db, "someUser", "Pass")
        executor.execute(
            "INSERT INTO Users(username, email, password) VALUES \
                          ('someFriend', 'xyz@test.com', 'Pass')"
        )
        executor.execute(
            "INSERT INTO Users(username, email, password) VALUES \
                         ('otherFriend', 'pqr@test.com', 'Pass')"
        )
        app = flask.Flask(__name__)

        result = ""
        with app.test_request_context("/"):
            add_friend(db, "someFriend", user)
            add_friend(db, "otherFriend", user)
            db.commit()

            result = get_friends(db, user)

        friends = []
        friends.append(result.json[0][0])
        friends.append(result.json[1][0])
        self.assertIn("someFriend", friends)
        self.assertIn("otherFriend", friends)

        executor.execute("SELECT idUsers FROM Users WHERE username = 'someFriend'")
        friend = executor.fetchall()[0][0]
        movies_to_review = [
            (2, 3, "2024-06-06"),
            (3, 4, "2024-06-05"),
            (5, 5, "2024-06-04"),
            (6, 2, "2024-06-03"),
            (11, 1, "2024-06-02"),
            (12, 3, "2024-06-01"),
        ]
        for movie in movies_to_review:
            executor.execute(
                "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                             VALUES (%s, %s, %s, %s, %s);",
                (
                    int(friend),
                    int(movie[0]),
                    int(movie[1]),
                    "this is an excellent movie",
                    movie[2],
                ),
            )
        db.commit()
        app = flask.Flask(__name__)
        result = []
        with app.test_request_context("/"):
            result = get_recent_friend_movies(db, "someFriend")
        self.assertEqual(5, len(result.json))
        for i, movie in enumerate(result.json):
            self.assertEqual(movie["score"], movies_to_review[i][1])

    def test_submit_review(self):
        """
        Test case 6
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "abc@test.com", "someUser", "Pass")
        user = login_to_account(db, "someUser", "Pass")
        app = flask.Flask(__name__)

        result = ""
        with app.test_request_context("/"):
            submit_review(
                db, user, "Forrest Gump (1994)", 9, "One of the best there is!!"
            )
            db.commit()

            executor.execute("SELECT score FROM Ratings WHERE movie_id = 13")
            result = executor.fetchall()[0][0]
            self.assertEqual(9, int(result))


if __name__ == "__main__":
    unittest.main()
