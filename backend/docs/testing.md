_**Below we describe different test-case files that we have written for checking the working of PopcornPicks!**_

# [test_predict.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test/test_predict.py)

Here test cases are written to check if the recommendations made by PopcornPicks are of good quality. <br/>
For example, for a movie input of "Spider-Man (2002)" and rating 5.0, the recommender returns "Masters of the Universe (1987)", which is a fair recommendation.

# [test_search.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test/test_search.py)

Here test cases are written to check if the movie-searching feature of PopcornPicks returns similar outputs to the input string! <br/>
For example, for keyword "love" the top-10 searches that PopcornPicks returns consist of the word "Love" making it related to the input keyword.

# [test_util.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test/test_util.py)

Here test cases are written to check the functionality of the email notifier feature, i.e., for every function corresponding to the feature - test_beautify_feedback_data(), test_create_colored_tags(), test_create_movie_genres(), test_send_email_to_user(), test_accounts(), test_get_wall_posts(), test_get_username(), test_get_recent_movies(), test_friends() and test_submit_review()

# [test_add_to_watched_history.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test_v7/watchedHistory/test_add_to_watched_history.py)

These unit tests cover a range of scenarios for adding movies to a user's watched history, including successfully adding movies, handling duplicate entries, managing movies not found in the database, adding multiple different movies, and testing with or without timestamps. Each test ensures the functionality behaves as expected in diverse conditions, maintaining robustness and reliability.

# [test_remove_from_watched_history.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test_v7/watchedHistory/test_remove_from_watched_history.py)

These unit tests validate the functionality of removing movies from the user's watched history, covering scenarios such as successfully removing existing entries, handling movies that are not in the watched history, attempting to remove movies not present in the database, testing with invalid user IDs or IMDb IDs, and ensuring correct behavior when dealing with multiple movies. <br/>
Each test helps maintain the robustness of the removal process for a consistent user experience.

# [test_add_to_watch_list.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test_v7/watchedHistory/test_add_to_watch_list.py)

These unit tests cover a range of scenarios for adding movies to a user's watch list, including successfully adding movies, handling duplicate entries, managing movies not found in the database, adding multiple different movies, and testing with or without timestamps. Each test ensures the functionality behaves as expected in diverse conditions, maintaining robustness and reliability.

# [test_drop_watch_list.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/test_v7/watchedHistory/test_drop_watch_list.py)

These unit tests validate the functionality of removing movies from the user's watch list, covering scenarios such as successfully removing existing entries, handling movies that are not in the Movies table, attempting to remove movies not present in the database, testing with invalid user IDs or IMDb IDs, and ensuring correct behavior when dealing with multiple movies. <br/>
Each test helps maintain the robustness of the removal process for a consistent user experience.
