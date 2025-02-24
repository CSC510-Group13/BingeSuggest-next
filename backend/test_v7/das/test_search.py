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
        search_word = "Please"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Please Don't Eat the Daisies (1960)",
            "Please Vote for Me (2007)",
            "Please Give (2010)",
            "Please Remove Your Shoes (2010)",
            "Please Murder Me (1956)",
            "Pleased to Meet Me (2013)",
            "Please Teach Me English (2003)",
            "Please Kill Mr. Know It All (2013)",
            "Stewart Lee: If You Prefer a Milder Comedian, Please Ask for One (2010)",
            "Happythankyoumoreplease (2010)",
        ]
        self.assertTrue(filtered_dict == expected_resp)

    def test_search_love(self):
        """
        Test case 2
        """
        search_word = "Don't"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Don't Be a Menace to South Central While Drinking Your Juice in the Hood (1996)",
            "Don't Look in the Basement (1973)",
            "Don't Tell Mom the Babysitter's Dead (1991)",
            "Don't Say a Word (2001)",
            "Don't Go in the House (1980)",
            "Don't Look Now (1973)",
            "Don't Bother to Knock (1952)",
            "Don't Tempt Me (2001)",
            "Don't Tell Anyone (1998)",
            "Don't Tell Her It's Me (1990)",
        ]
        self.assertTrue(filtered_dict == expected_resp)

    def test_search_gibberish(self):
        """
        Test case 3
        """
        search_word = "Randomize"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = []
        self.assertTrue(filtered_dict == expected_resp)


if __name__ == "__main__":
    unittest.main()
