# """
# Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
# This code is licensed under MIT license (see LICENSE for details)

# @author: PopcornPicks
# """
# pylint: disable=wrong-import-position
# pylint: disable=wrong-import-order
# pylint: disable=import-error
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
from unittest.mock import MagicMock, patch
import json

sys.path.append(str(Path(__file__).resolve().parents[1]))
# pylint: disable=wrong-import-position
from src.recommenderapp.utils import (
    create_colored_tags,
    beautify_feedback_data,
    create_movie_genres,
    send_email_to_user,
    create_account,
    login_to_account,
    get_wall_posts,
    get_username,
    get_recent_movies,
    add_friend,
    get_friends,
    submit_review,
    get_recent_friend_movies,
    create_or_update_discussion,
    get_discussion,
    get_username_data,
)

# pylint: enable=wrong-import-position

warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for utility functions
    """

    def setUp(self):
        self.db_mock = MagicMock()
        self.cursor_mock = MagicMock()
        self.db_mock.cursor.return_value = self.cursor_mock

    def test_beautify_feedback_data(self):
        """
        Test case 1
        """
        data = {"Movie 1": "Yet to watch", "Movie 2": "Like", "Movie 3": "Dislike"}
        result = beautify_feedback_data(data)
        expected_result = {
            "Liked": ["Movie 2"],
            "Disliked": ["Movie 3"],
            "Yet to Watch": ["Movie 1"],
        }

        self.assertTrue(result == expected_result)

    def test_create_colored_tags(self):
        """
        Test case 2
        """
        expected_result = '<span style="background-color: #FF1493; color: #FFFFFF; \
            padding: 5px; border-radius: 5px;">Musical</span>'
        result = create_colored_tags(["Musical"])
        self.assertTrue(result == expected_result)

    def test_create_movie_genres(self):
        """
        Test case 3
        """
        expected_result = {
            "Toy Story (1995)": ["Animation", "Comedy", "Family"],
            "Jumanji (1995)": ["Adventure", "Fantasy", "Family"],
        }

        data = [
            [
                "862",
                "Toy Story (1995)",
                "Animation|Comedy|Family",
                "tt0114709",
                " ",
                "/rhIRbceoE9lR4veEXuwCC2wARtG.jpg",
                "81",
            ],
            [
                "8844",
                "Jumanji (1995)",
                "Adventure|Fantasy|Family",
                "tt0113497",
                " ",
                "/vzmL6fP7aPKNKPRTFnZmiUfciyV.jpg",
                "104",
            ],
        ]

        movie_genre_df = pd.DataFrame(
            data,
            columns=[
                "movieId",
                "title",
                "genres",
                "imdb_id",
                "overview",
                "poster_path",
                "runtime",
            ],
        )

        result = create_movie_genres(movie_genre_df)
        self.assertTrue(result == expected_result)

    def test_send_email_to_user(self):
        """
        Test case 4
        """
        data = {
            "Liked": ["Toy Story (1995)"],
            "Disliked": ["Cutthroat Island (1995)"],
            "Yet to Watch": ["Assassins (1995)"],
        }
        with self.assertRaises(Exception):
            send_email_to_user("wrong_email", beautify_feedback_data(data))

    def test_accounts(self):
        """
        Test case 5
        """
        load_dotenv()
        self.cursor_mock.fetchone.return_value = None
        fail = login_to_account(self.db_mock, "testUser", "wrongPassword")
        self.assertIsNone(fail)

    def test_get_wall_posts(self):
        """
        Test case 6
        """
        self.cursor_mock.description = [["imdb_id"], ["name"], ["review"], ["score"]]
        self.cursor_mock.fetchall.return_value = [
            ("tt0076759", "Star Wars (1977)", "this is a great movie", 4)
        ]
        app = flask.Flask(__name__)
        a = ""
        with app.test_request_context("/"):
            a = get_wall_posts(self.db_mock)
        self.assertEqual(a.json[0]["imdb_id"], "tt0076759")
        self.assertEqual(a.json[0]["name"], "Star Wars (1977)")
        self.assertEqual(a.json[0]["review"], "this is a great movie")
        self.assertEqual(a.json[0]["score"], 4)

    def test_get_username(self):
        """
        Test case 7
        """
        app = flask.Flask(__name__)
        username = ""
        self.cursor_mock.fetchall.return_value = [["testUser"]]
        with app.test_request_context("/"):
            username = get_username(self.db_mock, 1).json
        self.assertEqual("testUser", username)

    def test_get_recent_movies(self):
        """
        Test case 8
        """
        self.cursor_mock.description = [["id"], ["score"], ["year"]]

        movies_to_review = [
            (2, 3, "1970-01-06"),
            (3, 4, "1970-01-05"),
            (5, 5, "1970-01-04"),
            (6, 2, "1970-01-03"),
            (11, 1, "1970-01-02"),
            (12, 3, "1970-01-01"),
        ]
        self.cursor_mock.fetchall.return_value = movies_to_review
        app = flask.Flask(__name__)

        recent_movies = []
        with app.test_request_context("/"):
            recent_movies = get_recent_movies(self.db_mock, 1)
        self.assertEqual(6, len(recent_movies.json))
        for i, movie in enumerate(recent_movies.json):
            self.assertEqual(movie["score"], movies_to_review[i][1])

    def test_friends(self):
        """
        Test case 9
        """

        movies_to_review = [
            (2, 3, "1970-01-06"),
            (3, 4, "1970-01-05"),
            (5, 5, "1970-01-04"),
            (6, 2, "1970-01-03"),
            (11, 1, "1970-01-02"),
            (12, 3, "1970-01-01"),
        ]
        self.cursor_mock.description = [["id"], ["score"], ["year"]]
        self.cursor_mock.fetchall.return_value = movies_to_review
        app = flask.Flask(__name__)
        result = []
        with app.test_request_context("/"):
            result = get_recent_friend_movies(self.db_mock, "testFriend")
        self.assertEqual(6, len(result.json))
        for i, movie in enumerate(result.json):
            self.assertEqual(movie["score"], movies_to_review[i][1])

    def test_create_discussion_new_movie(self):
        # Define test input
        data = {
            "imdb_id": "tt0111161",  # Example IMDB ID
            "user": "user1",
            "comment": "Amazing movie, a must-watch!",
        }

        # Mock the cursor to return None for no existing discussion
        self.cursor_mock.fetchone.return_value = None
        app = flask.Flask(__name__)
        # Call the function
        response = ""
        status_code = 404
        with app.test_request_context("/"):
            response, status_code = create_or_update_discussion(self.db_mock, data)

        # Check if the cursor's execute method was called to insert a new discussion
        self.cursor_mock.execute.assert_called_with(
            "Insert INTO Discussion (imdb_id, comments) values(%s,%s)",
            (
                data["imdb_id"],
                json.dumps([{"user": data["user"], "comment": data["comment"]}]),
            ),
        )

        # Check the returned response
        self.assertEqual(status_code, 200)
        self.assertIn(data["comment"], response.data.decode())
        self.assertIn(data["user"], response.data.decode())

    def test_update_discussion_existing_movie(self):
        # Define test input
        data = {
            "imdb_id": "tt0111161",  # Example IMDB ID
            "user": "user1",
            "comment": "Amazing movie, a must-watch!",
        }

        # Mock the cursor to return an existing discussion
        existing_comments = json.dumps([{"user": "user0", "comment": "Great movie!"}])
        self.cursor_mock.fetchone.return_value = ("id", "tt0111161", existing_comments)

        app = flask.Flask(__name__)
        # Call the function
        response = ""
        status_code = 404
        with app.test_request_context("/"):
            response, status_code = create_or_update_discussion(self.db_mock, data)

        # Check if the cursor's execute method was called to update the discussion
        self.cursor_mock.execute.assert_called_with(
            "Update Discussion set comments = %s where imdb_id = %s",
            (
                json.dumps(
                    [
                        {"user": "user0", "comment": "Great movie!"},
                        {"user": "user1", "comment": "Amazing movie, a must-watch!"},
                    ]
                ),
                data["imdb_id"],
            ),
        )

        # Check the returned response
        self.assertEqual(status_code, 200)
        self.assertIn(data["comment"], response.data.decode())
        self.assertIn(data["user"], response.data.decode())

    def test_get_discussion_no_comments(self):
        # Define test input
        imdb_id = "tt0111161"  # Example IMDB ID

        # Mock the cursor to return None for no existing comments
        self.cursor_mock.fetchone.return_value = [json.dumps([])]

        app = flask.Flask(__name__)
        # Call the function
        response = ""
        status_code = 404
        with app.test_request_context("/"):
            response, status_code = get_discussion(self.db_mock, imdb_id)

        # Check if the response status is OK and data is an empty list
        self.assertEqual(status_code, 200)
        self.assertEqual(response.json, [])

    def test_get_discussion_existing_comments(self):
        # Define test input
        imdb_id = "tt0111161"  # Example IMDB ID

        # Mock the cursor to return existing comments
        existing_comments = json.dumps([{"user": "user1", "comment": "Amazing movie!"}])
        self.cursor_mock.fetchone.return_value = [
            json.dumps([imdb_id, existing_comments])
        ]
        app = flask.Flask(__name__)
        response = ""
        status_code = 404
        with app.test_request_context("/"):
            response, status_code = get_discussion(self.db_mock, imdb_id)

        # Check if the response contains the existing comments
        self.assertEqual(status_code, 200)
        self.assertIn("Amazing movie!", response.data.decode())

    def test_get_username_data_valid_user(self):
        # Define test input
        user_id = 1  # Example user ID
        expected_username = "john_doe"  # Expected username for the given user ID

        # Mock the cursor to return a result with a username
        self.cursor_mock.fetchall.return_value = [
            (expected_username,)
        ]  # Return a tuple with the username

        app = flask.Flask(__name__)
        response = ""
        status_code = 404
        result = get_username_data(self.db_mock, user_id)

        # Verify that the result is the correct username
        self.assertEqual(result, expected_username)

        # Verify that the cursor's execute method was called with the correct query and parameters
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )

    def test_get_username_data_user_not_found(self):
        # Define test input
        user_id = 9999  # A non-existent user ID

        # Mock the cursor to return an empty list for no results
        self.cursor_mock.fetchall.return_value = []

        app = flask.Flask(__name__)
        response = ""
        status_code = 404
        with self.assertRaises(IndexError):
            get_username_data(self.db_mock, user_id)

        # Ensure the cursor's execute method was called
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )

    def test_get_username_data_invalid_user_id(self):
        # Define test input with an invalid user ID (non-integer)
        user_id = "invalid_id"  # Non-integer ID

        # Call the function and expect a TypeError or ValueError
        with self.assertRaises(ValueError):
            get_username_data(self.db_mock, user_id)

    def test_get_username_data_db_failure(self):
        # Define test input
        user_id = 1  # Example user ID

        # Simulate a database failure by raising an exception when executing the query
        self.cursor_mock.execute.side_effect = Exception("Database error")

        # Call the function and expect it to raise an exception
        with self.assertRaises(Exception):
            get_username_data(self.db_mock, user_id)

        # Ensure that the cursor's execute method was called
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )

    def test_get_username_data_multiple_rows(self):
        # Define test input
        user_id = 1  # Example user ID

        # Mock the cursor to return multiple rows (this is an unexpected scenario)
        self.cursor_mock.fetchall.return_value = [
            ("john_doe",),
            ("jane_doe",),
        ]  # Multiple rows

        # Call the function and expect an exception to be raised

        result = get_username_data(self.db_mock, user_id)
        # Ensure the cursor's execute method was called
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )
        self.assertEqual("john_doe", result)

    def test_get_username_data_none_result(self):
        # Define test input
        user_id = 1  # Example user ID

        # Mock the cursor to return None (which is not a typical behavior of fetchall, but we test it here)
        self.cursor_mock.fetchall.return_value = None

        # Call the function and expect it to handle the None result gracefully
        with self.assertRaises(TypeError):  # Expecting a TypeError due to None result
            get_username_data(self.db_mock, user_id)

        # Ensure the cursor's execute method was called
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )

    def test_get_username_data_empty_username(self):
        # Define test input
        user_id = 1  # Example user ID
        empty_username = ""  # Username with only spaces

        # Mock the cursor to return an empty username (with spaces)
        self.cursor_mock.fetchall.return_value = [
            (empty_username,)
        ]  # Return a tuple with spaces as username

        # Call the function
        result = get_username_data(self.db_mock, user_id)

        # Verify that the result is the empty username
        self.assertEqual(
            result, empty_username.strip()
        )  # The result should be an empty string after stripping spaces

        # Ensure the cursor's execute method was called
        self.cursor_mock.execute.assert_called_with(
            "SELECT username FROM Users WHERE idUsers = %s;", [user_id]
        )


if __name__ == "__main__":
    unittest.main()
