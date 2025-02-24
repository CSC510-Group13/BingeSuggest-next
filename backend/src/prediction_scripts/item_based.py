"""
Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks
"""

import os
import pandas as pd

app_dir = os.path.dirname(os.path.abspath(__file__))
code_dir = os.path.dirname(app_dir)
project_dir = os.path.dirname(code_dir)


def recommend_for_new_user(user_rating, gw, dw, aw):
    """
    Generates a list of recommended movie titles for a new user based on their ratings.
    """
    # ratings = pd.read_csv(os.path.join(project_dir, "data", "ratings.csv"))
    movies = pd.read_csv(os.path.join(project_dir, "data", "movies.csv"))
    user = pd.DataFrame(user_rating)
    user_movie_id = movies[movies["title"].isin(user["title"])]
    user_ratings = pd.merge(user_movie_id, user)

    movies_genre_filled = movies.copy(deep=True)
    copy_of_movies = movies.copy(deep=True)

    for index, row in copy_of_movies.iterrows():
        copy_of_movies.at[index, "genres"] = row["genres"].split("|")

    for index, row in copy_of_movies.iterrows():
        for genre in row["genres"]:
            movies_genre_filled.at[index, genre] = 1

    movies_genre_filled = movies_genre_filled.fillna(0)

    user_genre = movies_genre_filled[
        movies_genre_filled.movieId.isin(user_ratings.movieId)
    ]
    user_genre.drop(
        [
            "movieId",
            "title",
            "genres",
            "imdb_id",
            "overview",
            "poster_path",
            "runtime",
            "director",
            "actors",
            "imdb_ratings",
        ],
        axis=1,
        inplace=True,
    )
    user_profile = user_genre.T.dot(user_ratings.rating.to_numpy())

    movies_genre_filled.set_index(movies_genre_filled.movieId)
    movies_genre_filled.drop(
        [
            "movieId",
            "title",
            "genres",
            "imdb_id",
            "overview",
            "poster_path",
            "runtime",
            "director",
            "actors",
            "imdb_ratings",
        ],
        axis=1,
        inplace=True,
    )

    recommendations = (movies_genre_filled.dot(user_profile)) / user_profile.sum()

    join_movies_and_recommendations = movies.copy(deep=True)
    join_movies_and_recommendations["recommended"] = recommendations
    join_movies_and_recommendations.sort_values(
        by="recommended", ascending=False, inplace=True
    )

    top_recommendations = join_movies_and_recommendations.head(40000)

    # Calculate director and actor matching scores for top recommendations
    user_directors = set(
        director for movie in user_movie_id["director"] for director in movie.split(",")
    )
    user_actors = set(
        actor for movie in user_movie_id["actors"] for actor in movie.split(",")
    )

    # Score based on overlap with user's favorite directors and actors
    top_recommendations["director_match_score"] = top_recommendations["director"].apply(
        lambda directors: len(set(directors.split(",")).intersection(user_directors))
    )
    top_recommendations["actor_match_score"] = top_recommendations["actors"].apply(
        lambda actors: len(set(actors.split(",")).intersection(user_actors))
    )

    # Normalize IMDb rating and add it as a score component
    top_recommendations["imdb_ratings"] = top_recommendations["imdb_ratings"].replace(
        "Error", "1.0"
    )
    top_recommendations["imdb_ratings"] = top_recommendations["imdb_ratings"].replace(
        "No Rating Found", "1.0"
    )

    max_imdb_rating = top_recommendations["imdb_ratings"].astype(float).max()
    top_recommendations["normalized_imdb_rating"] = (
        top_recommendations["imdb_ratings"].astype(float) / max_imdb_rating
    )

    # Increase weights for director, actor scores, and IMDb rating in the final recommendation score
    top_recommendations["final_score"] = (
        gw * top_recommendations["recommended"]
        + dw * top_recommendations["director_match_score"]
        + aw * top_recommendations["actor_match_score"]
        + 0.4 * top_recommendations["normalized_imdb_rating"]
    )

    top_recommendations.sort_values(by="final_score", ascending=False, inplace=True)
    print(user["title"])
    top_recommendations = top_recommendations[
        ~top_recommendations["title"].isin(user["title"])
    ]

    return (
        list(top_recommendations["title"][:201]),
        list(top_recommendations["genres"][:201]),
        list(top_recommendations["imdb_id"][:201]),
    )


def recommend_for_new_user_g(user_rating):
    return recommend_for_new_user(user_rating, 1, 0, 0)


def recommend_for_new_user_d(user_rating):
    return recommend_for_new_user(user_rating, 0.1, 1, 0.1)


def recommend_for_new_user_a(user_rating):
    return recommend_for_new_user(user_rating, 0.1, 0.1, 1)


def recommend_for_new_user_all(user_rating):
    return recommend_for_new_user(user_rating, 0.5, 0.3, 0.3)
