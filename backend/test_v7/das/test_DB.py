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
    add_to_watchlist,
    get_imdb_id_by_name,
)

warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for DB
    """

    def setUp(self):
        print("\nRunning Setup:")
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
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        expected_username = "newUser"
        expected_email = "placeholder@test.com"
        expected_password = ("newPass").encode("utf-8")
        executor = db.cursor()
        executor.execute("SELECT * FROM Users;")
        db_result = executor.fetchall()
        actual_password = (db_result[0][3]).encode("utf-8")
        self.assertTrue(len(db_result) > 0)
        self.assertEqual(expected_username, db_result[0][1])
        self.assertEqual(expected_email, db_result[0][2])
        self.assertTrue(bcrypt.checkpw(expected_password, actual_password))
        fail = login_to_account(db, "newUser", "wrong")
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
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        executor.execute("SELECT idUsers FROM Users WHERE username='newUser'")
        db_result = executor.fetchall()
        user = db_result[0][0]
        executor.execute(
            "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                         VALUES (%s, %s, %s, %s, %s);",
            (int(user), int(13), int(4), "Worth Watching!", "2024-11-01"),
        )
        db.commit()
        app = flask.Flask(__name__)
        a = ""
        with app.test_request_context("/"):
            a = get_wall_posts(db)
        self.assertEqual(a.json[0]["imdb_id"], "tt0109830")
        self.assertEqual(a.json[0]["name"], "Forrest Gump (1994)")
        self.assertEqual(a.json[0]["review"], "Worth Watching!")
        self.assertEqual(a.json[0]["score"], 4)

    def test_get_username(self):
        """
        Test case 3
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        user = login_to_account(db, "newUser", "newPass")
        app = flask.Flask(__name__)
        username = ""
        with app.test_request_context("/"):
            username = get_username(db, user).json
        self.assertEqual("newUser", username)

    def test_get_recent_movies(self):
        """
        Test case 4
        """
        load_dotenv()
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1")
        executor = db.cursor()
        executor.execute("USE testDB;")
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        user = login_to_account(db, "newUser", "newPass")

        movies_to_review = [
            (12, 8, "2024-10-31"),
            (13, 8, "2024-10-30"),
            (14, 5, "2024-10-29"),
            (15, 9, "2024-10-28"),
            (16, 7, "2024-10-27"),
            (6, 6, "2024-10-26"),
        ]
        for movie in movies_to_review:
            executor.execute(
                "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                             VALUES (%s, %s, %s, %s, %s);",
                (
                    int(user),
                    int(movie[0]),
                    int(movie[1]),
                    "Absolute Cinema!",
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
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        user = login_to_account(db, "newUser", "newPass")
        executor.execute(
            "INSERT INTO Users(username, email, password) VALUES \
                          ('NewFriend', 'friend1@test.com', 'NewPass')"
        )
        executor.execute(
            "INSERT INTO Users(username, email, password) VALUES \
                         ('NewerFriend', 'friend2@test.com', 'NewerPass')"
        )
        app = flask.Flask(__name__)

        result = ""
        with app.test_request_context("/"):
            add_friend(db, "NewFriend", user)
            add_friend(db, "NewerFriend", user)
            db.commit()

            result = get_friends(db, user)

        friends = []
        friends.append(result.json[0][0])
        friends.append(result.json[1][0])
        self.assertIn("NewFriend", friends)
        self.assertIn("NewerFriend", friends)

        executor.execute("SELECT idUsers FROM Users WHERE username = 'NewFriend'")
        friend = executor.fetchall()[0][0]
        movies_to_review = [
            (2, 9, "2024-10-25"),
            (3, 8, "2024-10-24"),
            (5, 9, "2024-10-23"),
            (6, 8, "2024-10-22"),
            (11, 10, "2024-10-21"),
            (12, 9, "2024-10-20"),
        ]
        for movie in movies_to_review:
            executor.execute(
                "INSERT INTO Ratings(user_id, movie_id, score, review, time) \
                             VALUES (%s, %s, %s, %s, %s);",
                (
                    int(friend),
                    int(movie[0]),
                    int(movie[1]),
                    "Some of the great movies!",
                    movie[2],
                ),
            )
        db.commit()
        app = flask.Flask(__name__)
        result = []
        with app.test_request_context("/"):
            result = get_recent_friend_movies(db, "NewFriend")
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
        create_account(db, "placeholder@test.com", "newUser", "newPass")
        user = login_to_account(db, "newUser", "newPass")
        app = flask.Flask(__name__)

        result = ""
        with app.test_request_context("/"):
            submit_review(db, user, "Citizen Kane (1941)", 15, "Good old movie!")
            db.commit()

            executor.execute("SELECT score FROM Ratings WHERE movie_id = 15")
            result = executor.fetchall()[0][0]
            self.assertEqual(15, int(result))


if __name__ == "__main__":
    unittest.main()
