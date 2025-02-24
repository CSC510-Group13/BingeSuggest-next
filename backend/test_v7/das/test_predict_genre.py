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
            {"title": "The Dictator (2012)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue("Milk Brothers (1976)" in recommendations)

    def test_cartoon(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Finding Nemo (2003)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("The Lion King (1994)" in recommendations))

    def test_sciFi_cartoon(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Big Hero 6 (2014)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(
            ("How to Train Your Dragon 2 (2014)" in recommendations)
            and ("Kung Fu Panda 3 (2016)" in recommendations)
            and ("Despicable Me 3 (2017)" in recommendations)
        )

    def test_mystery(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Now You See Me (2013)", "rating": 5.0},
            {"title": "Now You See Me 2 (2016)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("Young Sherlock Holmes (1985)" in recommendations))


if __name__ == "__main__":
    unittest.main()
