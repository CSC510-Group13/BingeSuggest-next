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


class TestAddToWatchList(unittest.TestCase):
    """
    Test cases for adding movies to watched history.
    """

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

    def test_add_movie_success_different_movie(self):
        """
        Test adding a different movie successfully.
        """
        create_account(self.db, "user4@test.com", "user4", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = add_to_watchlist(self.db, user_id, "0266543")
        self.assertTrue(result)

    def test_add_movie_already_exists_different_movie(self):
        """
        Test adding a movie that already exists in watched history with a different movie.
        """
        create_account(self.db, "user5@test.com", "user5", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "0266543")
        result = add_to_watchlist(self.db, user_id, "0266543")
        self.assertFalse(result)

    def test_add_movie_not_in_database_different_movie(self):
        """
        Test adding a movie that is not in the database with a different movie.
        """
        create_account(self.db, "user6@test.com", "user6", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = add_to_watchlist(self.db, user_id, "0000000", None)
        self.assertTrue(result)

    def test_add_multiple_movies_success(self):
        """
        Test adding multiple movies successfully.
        """
        create_account(self.db, "user7@test.com", "user7", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        movies = ["0109830", "0169547"]
        for movie in movies:
            result = add_to_watchlist(self.db, user_id, movie)
            self.assertTrue(result)

    def test_add_movie_with_provided_timestamp(self):
        """
        Test adding a movie with a provided timestamp.
        """
        create_account(self.db, "user8@test.com", "user8", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = add_to_watchlist(self.db, user_id, "0033467", "2024-11-23 12:00:00")
        self.assertTrue(result)

    def test_add_movie_no_timestamp(self):
        """
        Test adding a movie without a timestamp.
        """
        create_account(self.db, "user9@test.com", "user9", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = add_to_watchlist(self.db, user_id, "0168629", None)
        self.assertTrue(result)

    def test_add_movie_to_watchlist_duplicate_user(self):
        """
        Test adding a movie to watchlist for the same user multiple times.
        """
        create_account(self.db, "user10@test.com", "user10", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        add_to_watchlist(self.db, user_id, "0168629", None)
        result = add_to_watchlist(self.db, user_id, "0168629", None)
        self.assertFalse(result)

    def test_add_movie_to_watchlist_invalid_user(self):
        """
        Test adding a movie to watchlist with an invalid user ID.
        """
        result = add_to_watchlist(self.db, 999, "0168629", None)
        self.assertTrue(result)

    def test_add_movie_not_found_in_watchlist(self):
        """
        Test trying to add a movie that doesn't exist in the database.
        """
        create_account(self.db, "user11@test.com", "user11", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        result = add_to_watchlist(self.db, user_id, "9999999", None)
        self.assertTrue(result)

    def test_add_movie_different_movies(self):
        """
        Test adding multiple different movies to the watchlist for the same user.
        """
        create_account(self.db, "user12@test.com", "user12", "password123")
        self.executor.execute("SELECT idUsers FROM Users;")
        user_id = self.executor.fetchone()[0]
        movies = ["0109830", "0113101", "0094675"]
        for movie in movies:
            result = add_to_watchlist(self.db, user_id, movie, None)
            self.assertTrue(result)


if __name__ == "__main__":
    unittest.main()
