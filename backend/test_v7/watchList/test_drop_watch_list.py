import sys
import unittest
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

sys.path.append(str(Path(__file__).resolve().parents[2]))
from src.recommenderapp.utils import (
    create_account,
    add_to_watchlist,
    remove_from_watchlist,
)


class TestRemoveFromWatchList(unittest.TestCase):
    def setUp(self):
        """
        Set up test database before each test.
        """
        print("\nrunning setup method")
        load_dotenv()
        self.db = mysql.connector.connect(
            user="root", password="root", host="127.0.0.1"
        )
        self.executor = self.db.cursor()
        self.executor.execute("USE testDB;")
        self.executor.execute("SET FOREIGN_KEY_CHECKS=0;")
        self.executor.execute("DELETE FROM Users;")
        self.executor.execute("DELETE FROM Watchlist;")
        self.db.commit()

    def test_remove_movie_success(self):
        """
        Test removing a movie successfully from watched history.
        """
        create_account(self.db, "user1@test.com", "user1", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "710", None)
        _, result = remove_from_watchlist(self.db, user_id, "710")
        self.assertEqual(result, "Movie not in watchlist")

    def test_remove_nonexistent_movie(self):
        """
        Test removing a movie that is not in watchlist.
        """
        create_account(self.db, "user2@test.com", "user2", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = remove_from_watchlist(self.db, user_id, "0266543")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_not_in_database(self):
        """
        Test removing a movie that does not exist in the database.
        """
        create_account(self.db, "user3@test.com", "user3", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = remove_from_watchlist(self.db, user_id, "0000000")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_invalid_user(self):
        """
        Test removing a movie with an invalid user ID.
        """
        create_account(self.db, "user4@test.com", "user4", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "0076759", None)
        result = remove_from_watchlist(self.db, 999, "0076759")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_no_user_provided(self):
        """
        Test removing a movie without providing a user ID.
        """
        create_account(self.db, "user5@test.com", "user5", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "0076759", None)
        result = remove_from_watchlist(self.db, None, "0076759")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_empty_imdb_id(self):
        """
        Test removing a movie with an empty IMDb ID.
        """
        create_account(self.db, "user6@test.com", "user6", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = remove_from_watchlist(self.db, user_id, "")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_invalid_imdb_id(self):
        """
        Test removing a movie with an invalid IMDb ID.
        """
        create_account(self.db, "user7@test.com", "user7", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = remove_from_watchlist(self.db, user_id, "invalid_id")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_not_in_watched_history(self):
        """
        Test removing a movie that the user has not added to their watched history.
        """
        create_account(self.db, "user10@test.com", "user10", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = remove_from_watchlist(self.db, user_id, "0266543")
        self.assertEqual(result, (None, "Movie not in watchlist"))

    def test_remove_movie_no_timestamp(self):
        """
        Test removing a movie without a timestamp provided.
        """
        create_account(self.db, "user10@test.com", "user10", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "710", None)
        _, result = remove_from_watchlist(self.db, user_id, "710")
        self.assertEqual(result, "Movie not in watchlist")

    def test_remove_movie_with_multiple_movies(self):
        """
        Test removing a movie when the user has multiple movies in watched history.
        """
        create_account(self.db, "user11@test.com", "user11", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "9091", None)
        add_to_watchlist(self.db, user_id, "710", None)
        _, result = remove_from_watchlist(self.db, user_id, "9091")
        self.assertEqual(result, "Movie not in watchlist")
        _, result = remove_from_watchlist(self.db, user_id, "710")
        self.assertEqual(result, "Movie not in watchlist")


if __name__ == "__main__":
    unittest.main()
