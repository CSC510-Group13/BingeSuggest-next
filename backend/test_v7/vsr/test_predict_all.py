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

    def test_toy_story(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Toy Story (1995)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue("Space Jam (1996)" in recommendations)

    def test_hindi_movie(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Bachna Ae Haseeno (2008)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("Zootopia (2016)" in recommendations) is False)

    def test_kunfu_panda(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Kung Fu Panda (2008)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue("Zootopia (2016)" in recommendations)

    def test_robo_cop(self):
        """
        Test case 4
        """
        ts = [
            {"title": "RoboCop (1987)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("Star Trek: First Contact (1996)" in recommendations))

    def test_iron_man(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Iron Man (2008)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_all(ts)
        self.assertTrue(("Green Lantern: Emerald Knights (2011)" in recommendations))


if __name__ == "__main__":
    unittest.main()
