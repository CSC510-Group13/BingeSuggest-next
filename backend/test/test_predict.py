# """
# Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
# This code is licensed under MIT license (see LICENSE for details)

# @author: PopcornPicks
# """

# import sys
# import unittest
# import warnings
# from pathlib import Path

# sys.path.append(str(Path(__file__).resolve().parents[1]))
# # pylint: disable=wrong-import-position
# from src.prediction_scripts.item_based import recommend_for_new_user

# # pylint: enable=wrong-import-position
# warnings.filterwarnings("ignore")


# class Tests(unittest.TestCase):
#     """
#     Test cases for recommender system
#     """

#     def test_toy_story(self):
#         """
#         Test case 1
#         """
#         ts = [
#             {"title": "Toy Story (1995)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue("Space Jam (1996)" in recommendations)

#     def test_kunfu_panda(self):
#         """
#         Test case 2
#         """
#         ts = [
#             {"title": "Kung Fu Panda (2008)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue("Zootopia (2016)" in recommendations)

#     def test_hindi_movie(self):
#         """
#         Test case 3
#         """
#         ts = [
#             {"title": "Bachna Ae Haseeno (2008)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Zootopia (2016)" in recommendations) is False)

#     def test_iron_man(self):
#         """
#         Test case 4
#         """
#         ts = [
#             {"title": "Iron Man (2008)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Green Lantern: Emerald Knights (2011)" in recommendations))

#     def test_robo_cop(self):
#         """
#         Test case 5
#         """
#         ts = [
#             {"title": "RoboCop (1987)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Star Trek: First Contact (1996)" in recommendations))

#     def test_nolan(self):
#         """
#         Test case 6
#         """
#         ts = [
#             {"title": "Inception (2010)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Zenith (2010)" in recommendations))

#     def test_dc(self):
#         """
#         Test case 7
#         """
#         ts = [
#             {"title": "Man of Steel (2013)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Iceman (2014)" in recommendations))

#     def test_armageddon(self):
#         """
#         Test case 8
#         """
#         ts = [
#             {"title": "Armageddon (1998)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Planet of the Apes (2001)" in recommendations))

#     def test_lethal_weapon(self):
#         """
#         Test case 9
#         """
#         ts = [
#             {"title": "Lethal Weapon (1987)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("The Machine Girl (2008)" in recommendations))

#     def test_dark_action(self):
#         """
#         Test case 10
#         """
#         ts = [
#             {"title": "Batman Returns (1992)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Masters of the Universe (1987)" in recommendations))

#     def test_dark(self):
#         """
#         Test case 11
#         """
#         ts = [
#             {"title": "Puppet Master (1989)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Rabies (2010)" in recommendations))

#     def test_horror_comedy(self):
#         """
#         Test case 12
#         """
#         ts = [
#             {"title": "Scary Movie (2000)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("The Bélier Family (2014)" in recommendations))

#     def test_super_heroes(self):
#         """
#         Test case 13
#         """
#         ts = [
#             {"title": "Spider-Man (2002)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Masters of the Universe (1987)" in recommendations))

#     def test_cartoon(self):
#         """
#         Test case 14
#         """
#         ts = [
#             {"title": "Moana (2016)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("Minions (2015)" in recommendations))

#     def test_multiple_movies(self):
#         """
#         Test case 15
#         """
#         ts = [
#             {"title": "Twilight Saga: New Moon, The (2009)", "rating": 5.0},
#             {"title": "Harry Potter and the Goblet of Fire (2005)", "rating": 5.0},
#         ]
#         recommendations, _, _ = recommend_for_new_user(ts)
#         self.assertTrue(("The Secret of Moonacre (2008)" in recommendations))


# if __name__ == "__main__":
#     unittest.main()
