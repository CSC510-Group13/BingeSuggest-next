"""
Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks

Test suit for search feature
"""

import sys
import unittest
import warnings
from pathlib import Path

sys.path.append(str(Path(__file__).resolve().parents[2]))
# pylint: disable=wrong-import-position
from src.recommenderapp.search import Search

# pylint: enable=wrong-import-position

warnings.filterwarnings("ignore")


class Tests(unittest.TestCase):
    """
    Test cases for search feature
    """

    def test_search_runner(self):
        """
        Test case 1
        """
        search_word = "runner"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Runner Runner (2013)",
            "Blade Runner (1982)",
            "Atanarjuat: The Fast Runner (2002)",
            "The Indian Runner (1991)",
            "Dangan Runner (1996)",
            "The Loneliness of the Long Distance Runner (1962)",
            "The Kite Runner (2007)",
            "Frontrunners (2008)",
            "The Bugs Bunny/Road Runner Movie (1979)",
            "The Runner (1984)",
        ]
        self.assertTrue(filtered_dict == expected_resp)

    def test_search_love(self):
        """
        Test case 2
        """
        search_word = "love"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Love & Human Remains (1993)",
            "Love Affair (1994)",
            "Love and a .45 (1994)",
            "Lover's Knot (1996)",
            "Love in the Afternoon (1957)",
            "Love Is All There Is (1996)",
            "Love Jones (1997)",
            "Love and Other Catastrophes (1996)",
            "Love! Valour! Compassion! (1997)",
            "Love Serenade (1996)",
        ]
        self.assertTrue(filtered_dict == expected_resp)

    def test_search_gibberish(self):
        """
        Test case 3
        """
        search_word = "gibberish"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = []
        self.assertTrue(filtered_dict == expected_resp)


if __name__ == "__main__":
    unittest.main()
