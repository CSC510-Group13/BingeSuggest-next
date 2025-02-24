# The flask routes - how different routes work together, and what function they serve

By Teddy @tddschn

This doc can help you understand how the different routes in the Flask application work together to provide a seamless user experience. It will also help you understand how the different Python files interact with each other.

**User Authentication and Session Management:**

*   `/`: (GET) Serves the login page (`login.html`).  (POST) Handles user account creation.
*   `/log`: (POST) Handles user login.  On successful login, it stores the user's ID in the `user` dictionary (`user[1] = user_id`). This acts as a basic session management.
*   `/out`: (POST) Handles user sign-out by setting `user[1] = None`.
*   `/guest`: (POST) Allows a user to enter as a guest without logging in, setting `user[1] = "guest"`.
*   `/profile`: (GET) Serves the profile page (`profile.html`) if a user is logged in.
*   `/landing`: (GET) Serves the landing page (`landing_page.html`) if a user is logged in.

**Recommendation Endpoints:**

These endpoints handle movie recommendations based on different algorithms:

*   `/genreBased`: (POST) Takes a list of movie titles as input and returns movie recommendations using a genre-based algorithm (`recommend_for_new_user_g`).
*   `/dirBased`: (POST) Takes a list of movie titles as input and returns movie recommendations using a director-based algorithm (`recommend_for_new_user_d`).
*   `/actorBased`: (POST) Takes a list of movie titles as input and returns movie recommendations using an actor-based algorithm (`recommend_for_new_user_a`).
*   `/all`: (POST) Takes a list of movie titles as input and returns movie recommendations using a combined algorithm (`recommend_for_new_user_all`).

These routes are designed to take user input (movie preferences), process it using the Python files and then return recommendations.

**Search Functionality:**

*   `/search_page`: (GET) Serves the search page (`search_page.html`).
*   `/search`: (POST) Takes a search query, uses the `Search` class to find matching movies, and returns the results as JSON.

**Social Features:**

*   `/wall`: (GET) Serves the wall page (`wall.html`).
*   `/review`: (GET) Serves the review page (`review.html`). (POST)  Handles the submission of a movie review.
*   `/friend`: (POST) Handles adding a friend to the user's friend list.
*   `/getWallData`: (GET) Retrieves wall posts (movie reviews) from the database.
*   `/getRecentMovies`: (GET) Retrieves the recently reviewed movies for the logged-in user.
*   `/getRecentFriendMovies`: (POST) Retrieves the recently reviewed movies for a specific friend.
*   `/getUserName`: (GET) Retrieves the username of the logged-in user.
*   `/getFriends`: (GET) Retrieves the friend list of the logged-in user.

**Watchlist Functionality:**

*   `/watchlist`: (GET) Serves the watchlist page (`watchlist.html`).
*   `/add_to_watchlist`: (POST) Adds a movie to the user's watchlist.
*   `/getWatchlistData`: (GET) Retrieves the user's watchlist data.
*   `/deleteWatchlistData`: (POST) Deletes a movie from the user's watchlist.

**Watched History Functionality:**

*   `/watched_history`: (GET) Serves the watched history page (`watched_history.html`).
*   `/add_to_watched_history`: (POST) Adds a movie to the user's watched history.
*   `/getWatchedHistoryData`: (GET) Retrieves the user's watched history.
*   `/removeFromWatchedHistory`: (POST) Removes a movie from the user's watched history.

**Movie Details and Discussion:**

*   `/movie/<id>`: (GET)  Serves the movie details page (`movie.html`) for a specific movie ID (IMDb ID).  Fetches movie data from OMDB API. Also serves as the location of the movie discussion.
*   `/movieDiscussion/<id>`: (GET) Retrieves the discussion data for a specific movie (IMDb ID). (POST) Adds a new comment to the discussion for a specific movie.

**Other Utilities:**

*   `/feedback`: (POST) Handles user feedback data.
*   `/sendMail`: (POST) Sends an email to the user with their movie recommendations.
*   `/get_api_key`: (GET) Retrieves the OMDB API key (securely, from environment variables).
*   `/success`: (GET) Serves a success page (`success.html`).

**Database Interaction:**

The application extensively uses a MySQL database to store user accounts, movie data, reviews, friend relationships, watchlists, and watched history. The `before_request` and `after_request` functions ensure a database connection is established before each request and closed afterward.  Several utility functions in `utils.py` handle specific database operations.

**Workflow:**

1.  A user interacts with the frontend (HTML templates).
2.  The frontend sends requests to various routes defined in `app.py`.
3.  `app.py` processes these requests:
    *   It might render a template (serve a webpage).
    *   It might interact with the database using functions from `utils.py`.
    *   It might call recommendation algorithms from `item_based.py`.
    *   It might make external API calls (e.g., to OMDB).
4.  `app.py` returns a response (HTML, JSON data, etc.) back to the frontend.
5. The frontend shows it to the user.

