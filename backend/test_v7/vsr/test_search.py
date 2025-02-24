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

    def test_search_toy(self):
        """
        Test case 1
        """
        search_word = "toy"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Toy Story (1995)",
            "Toys (1992)",
            "Toy Story 2 (1999)",
            "Toy Soldiers (1991)",
            "Toy Story 3 (2010)",
            "Toys in the Attic (1963)",
            "Toy Story of Terror! (2013)",
            "Toy Story That Time Forgot (2014)",
            "Toys in the Attic (2009)",
            "Toy Soldiers (1984)",
        ]
        self.assertTrue(filtered_dict == expected_resp)

    def test_search_night(self):
        """
        Test case 4
        """
        search_word = "night"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "Night of the living Dead (1968)",
            "Night on Earth (1991)",
            "Nightwatch (1997)",
            "Night Falls on Manhattan (1996)",
            "Nights of Cabiria (1957)",
            "Night Shift (1982)",
            "Night of the Comet (1984)",
            "Nightmares (1983)",
            "Nighthawks (1981)",
            "Night Tide (1961)",
        ]

    def test_search_2001(self):
        """
        Test case 4
        """
        search_word = "2001"
        finder = Search()
        filtered_dict = finder.results_top_ten(search_word)
        expected_resp = [
            "2001: A Space Odyssey (1968)",
            "2001 Maniacs (2005)",
            "2001: A Space Travesty (2000)",
            "Songcatcher (2001)",
            "Antitrust (2001)",
            "Double Take (2001)",
            "Save the Last Dance (2001)",
            "The Pledge (2001)",
            "The Amati Girls (2001)",
            "Sugar & Spice (2001)",
        ]

        self.assertTrue(filtered_dict == expected_resp)


if __name__ == "__main__":
    unittest.main()
