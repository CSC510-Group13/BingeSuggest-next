import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position


from src.prediction_scripts.item_based import recommend_for_new_user_g

# pylint: enable=wrong-import-position
warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for recommender system
    """

    def test_musicals(self):
        """
        Test case 1
        """
        ts = [
            {"title": "La La Land (2016)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue("Shall We Dance? (1996)" in recommendations)

    def test_horror(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Insidious (2010)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue("The Exorcist (1973)" in recommendations)

    def test_sciFi(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Interstellar (2014)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("The Martian (2015)" in recommendations))

    def test_sciFi_action(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Iron Man (2008)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("Star Wars (1977)" in recommendations))

    def test_thriller(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Now You See Me (2013)", "rating": 5.0},
            {"title": "Ocean's Eleven (2001)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_g(ts)
        self.assertTrue(("The Dark Knight (2008)" in recommendations))


if __name__ == "__main__":
    unittest.main()
