import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position
from src.prediction_scripts.item_based import recommend_for_new_user_d

# pylint: enable=wrong-import-position
warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for director based recommender system
    """

    def test_steven_spielberg(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Lincoln (2012)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue("Catch Me If You Can (2002)" in recommendations)

    def test_martin_scorsese(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Taxi Driver (1976)", "rating": 5.0},
            {"title": "The Wolf of Wall Street (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue("Raging Bull (1980)" in recommendations)

    def test_francis_coppola(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Dracula (1992)", "rating": 5.0},
            {"title": "The Rainmaker (1997)", "rating": 5.0},
            {
                "title": "Hearts of Darkness: A Filmmaker's Apocalypse (1991)",
                "rating": 5.0,
            },
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(("The Godfather: Part III (1990)" in recommendations))

    def test_david_fincher(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Se7en (1995)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(("Fight Club (1999)" in recommendations))

    def test_james_cameron(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Terminator 2: Judgment Day (1991)", "rating": 5.0},
            {"title": "Aliens (1986)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("Avatar (2009)" in recommendations)
            and ("Titanic (1997)" in recommendations)
        )


if __name__ == "__main__":
    unittest.main()
