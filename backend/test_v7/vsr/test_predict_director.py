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
    Test cases for recommender system
    """

    def test_christopher_nolan(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Interstellar (2014)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue("Inception (2010)" in recommendations)

    def test_louis(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Now You See Me (2013)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue("Now You See Me 2 (2016)" in recommendations)

    def test_nolan_jon(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Interstellar (2014)", "rating": 5.0},
            {"title": "Iron Man (2008)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("The Prestige (2006)" in recommendations)
            and ("Iron Man 2 (2010)" in recommendations)
        )

    def test_marvel(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Captain America: The First Avenger (2011)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("Captain America: The Winter Soldier (2014)" in recommendations)
            and ("Captain America: Civil War (2016)" in recommendations)
        )

    def test_francis(self):
        """
        Test case 5
        """
        ts = [
            {"title": "The Godfather (1972)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(("Apocalypse Now (1979)" in recommendations))


if __name__ == "__main__":
    unittest.main()
