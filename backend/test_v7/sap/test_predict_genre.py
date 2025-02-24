import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))

from src.prediction_scripts.item_based import recommend_for_new_user_g

warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for genre based recommender system
    """

    def test_comedy(self):
        """
        Test case 1
        """
        ts = [
            {"title": "The Hangover (2009)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue("Forrest Gump (1994)" in recommendations)

    def test_drama(self):
        """
        Test case 2
        """
        ts = [
            {"title": "The Intern (2015)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue("The Chaos Class (1975)" in recommendations)

    def test_animated(self):
        """
        Test case 3
        """
        ts = [
            {"title": "The Croods (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("Shrek (2001)" in recommendations))

    def test_sciFi_animated(self):
        """
        Test case 4
        """
        ts = [
            {"title": "WALL·E (2008)", "rating": 5.0},
            {"title": "Spirited Away (2001)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("Aladdin (1992)" in recommendations))

    def test_mystery(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Prisoners (2013)", "rating": 5.0},
            {"title": "Trap (2007)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("The Sicilian Girl (2008)" in recommendations))


if __name__ == "__main__":
    unittest.main()
