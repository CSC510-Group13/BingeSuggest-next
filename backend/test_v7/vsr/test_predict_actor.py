import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position


from src.prediction_scripts.item_based import recommend_for_new_user_a

# pylint: enable=wrong-import-position
warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for recommender system
    """

    def test_leonardo(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Catch Me If You Can (2002)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("The Wolf of Wall Street (2013)" in recommendations)

    def test_tom(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Mission: Impossible (1996)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(
            "Mission: Impossible - Ghost Protocol (2011)" in recommendations
        )

    def test_chris(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Thor (2011)", "rating": 5.0},
            {"title": "Extraction (2015)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(("Thor: The Dark World (2013)" in recommendations))

    def test_avengers(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Avengers: Age of Ultron (2015)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(
            ("Captain America: The Winter Soldier (2014)" in recommendations)
            and ("Iron Man 2 (2010)" in recommendations)
        )

    def test_thriller(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Now You See Me (2013)", "rating": 5.0},
            {"title": "Ocean's Eleven (2001)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(("The Dark Knight (2008)" in recommendations))


if __name__ == "__main__":
    unittest.main()
