import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position
from src.prediction_scripts.item_based import recommend_for_new_user_all

# pylint: enable=wrong-import-position
warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for recommender system
    """

    def test_1(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Justice League (2017)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(
            "Batman v Superman: Dawn of Justice (2016)" in recommendations
            and "300 (2006)" in recommendations
            and "Thor: Ragnarok (2017)" in recommendations
            and "Watchmen (2009)" in recommendations
        )

    def test_2(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Zindagi Na Milegi Dobara (2011)", "rating": 5.0},
            {"title": "Yeh Jawaani Hai Deewani (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue("Wake Up Sid (2009)" in recommendations)


if __name__ == "__main__":
    unittest.main()
