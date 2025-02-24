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

    def test_arnold_schwarzenegger(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Total Recall (1990)", "rating": 5.0},
            {"title": "Predator (1987)", "rating": 5.0},
            {"title": "Pumping Iron (1977)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("RoboCop (1987)" in recommendations)

    def test_brad_and_clooney(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Burn After Reading (2008)", "rating": 5.0},
            {"title": "Gravity (2013)", "rating": 5.0},
            {"title": "8 (2010)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue("Ocean's Thirteen (2007)" in recommendations)

    def test_dc_cast(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Armageddon (1998)", "rating": 5.0},
            {"title": "The Man from U.N.C.L.E. (2015)", "rating": 5.0},
            {"title": "Keeping Up with the Joneses (2016)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(
            ("Man of Steel (2013)" in recommendations)
            and ("RED (2010)" in recommendations)
        )

    def test_de_niro(self):
        """
        Test case 4
        """
        ts = [
            {"title": "Limitless (2011)", "rating": 5.0},
            {"title": "1900 (1976)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(
            ("The Godfather: Part II (1974)" in recommendations)
            and ("Raging Bull (1980)") in recommendations
        )

    def test_al_pacino(self):
        """
        Test case 5
        """
        ts = [
            {"title": "Heat (1995)", "rating": 5.0},
            {"title": "Carlito's Way (1993)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_a(ts)
        self.assertTrue(("Mission: Impossible (1996)" in recommendations))


if __name__ == "__main__":
    unittest.main()
