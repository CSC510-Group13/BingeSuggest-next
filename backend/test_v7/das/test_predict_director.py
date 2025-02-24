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
    Test cases for director based recommendation system
    """

    def test_christopher_nolan(self):
        """
        Test case 1
        """
        ts = [
            {"title": "Memento (2000)", "rating": 5.0},
            {"title": "Inception (2010)", "rating": 5.0},
            {"title": "Interstellar (2014)", "rating": 5.0},
            {"title": "Dunkirk (2017)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("The Dark Knight Rises (2012)" in recommendations)
            and ("The Dark Knight (2008)" in recommendations)
            and ("The Prestige (2006)" in recommendations)
            and ("Batman Begins (2005)" in recommendations)
        )

    def test_james_wan(self):
        """
        Test case 2
        """
        ts = [
            {"title": "Furious 7 (2015)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("Death Sentence (2007)" in recommendations)
            and ("Dead Silence (2007)" in recommendations)
            and ("Insidious (2010)" in recommendations)
            and ("The Conjuring (2013)" in recommendations)
        )

    def test_michael_bay(self):
        """
        Test case 3
        """
        ts = [
            {"title": "Transformers (2007)", "rating": 5.0},
        ]
        recommendations, _, _ = recommend_for_new_user_d(ts)
        self.assertTrue(
            ("Transformers: Revenge of the Fallen (2009)" in recommendations)
            and ("The Island (2005)" in recommendations)
            and ("Armageddon (1998)" in recommendations)
            and ("Bad Boys (1995)" in recommendations)
        )


if __name__ == "__main__":
    unittest.main()
