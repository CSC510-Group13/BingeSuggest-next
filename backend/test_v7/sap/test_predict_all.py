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
            {"title": "Iron Man (2008)", "rating": 5.0},
            {"title": "Thor (2011)", "rating": 5.0},
            {"title": "Captain America: The First Avenger (2011)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(
            "The Avengers (2012)" in recommendations
            and "Captain America: Civil War (2016)" in recommendations
        )

    def test_2(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Megamind (2010)", "rating": 5.0},
            {"title": "Mr. Peabody & Sherman (2014)", "rating": 5.0},
            {"title": "Frozen (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue("Stuart Little (1999)" in recommendations)

    def test_3(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Interstellar (2014)", "rating": 5.0},
            {"title": "Now You See Me (2013)", "rating": 5.0},
            {"title": "The Pursuit of Happyness (2006)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("No Country for Old Men (2007)" in recommendations))

    def test_4(self):
        """
        Test case 4
        """
        ts = [
            {"title": "The Maze Runner (2014)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("The Arrival (1996)" in recommendations))

    def test_5(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Indiana Jones and the Last Crusade (1989)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("Six Days Seven Nights (1998)" in recommendations))


if __name__ == "__main__":
    unittest.main()
