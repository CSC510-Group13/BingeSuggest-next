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
    Test cases for actor based recommender system
    """

    def test_rdj(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Iron Man (2008)", "rating": 5.0},
            {"title": "Iron Man 2 (2010)", "rating": 5.0},
            {"title": "Iron Man 3(2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("The Avengers (2012)" in recommendations)

    def test_ryan_and_emma(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Crazy, Stupid, Love. (2011)", "rating": 5.0},
            {"title": "Gangster Squad (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("La La Land (2016)" in recommendations)

    def test_magic(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Now You See Me (2013)", "rating": 5.0},
            {"title": "Now You See Me 2 (2016)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("Zombieland (2009)" in recommendations)


if __name__ == "__main__":
    unittest.main()
