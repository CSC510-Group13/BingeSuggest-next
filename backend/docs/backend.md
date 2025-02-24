# Functions Description of the backend

## [app.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/src/recommenderapp/app.py)

### login_page()

**Renders to the login page of the web-app**

### profile_page()

**Renders to the profile page of the web-app**

### wall_page()

**Renders to the wall page of the web-app**

### review_page()

**Renders to the review page of the web-app**

### landing_page()

**Renders to the landing page of the web-app**

### search_page()

**Render to the search page of the web-app**

### predict()

**Returns movie recommendations on the basis of user-input movies**

### search()

**Returns top-10 movie searches for an input string in the search box**

### create_acc()

**Handles creating a new account**

### signout()

**Handles signing out the active user**

### login()

**Handles logging in the active user**

### friend()

**Handles adding a new friend**

### guest()

**Sets the user to be a guest user**

### review()

**Handles the submission of a movie review**

### wall_posts()

**Gets the posts for the wall**

### recent_movies()

**Gets the recent movies of the active user**

### recent_friend_movies()

**Gets the recent movies of a certain friend**

### username()

**Gets the username of the active user**

### get_friend()

**Gets the friends of the active user**

### feedback()

**Handles user feedback submission**

### send_mail()

**Handles user feedback submission and mails the results**

### success()

**Renders to the success page**

### def moviePage(id)

**Renders the movie page where we can see the discussion on the movie**

### def getMovieDisccusion()

**Gets the discussion corresponding to a movie indicated through a imdb_id**

### def postCommentOnMovieDisccusion()

**Post Method to added a comment in the discussion for a movie**

### before_request()

**Opens the db connection.**

### after_request()

**Closes the db connection.**

### get_api_key()

**Gets the api key from the .env file**

## add_movie_to_watched_history()
**Adds a movie to the watched history of the user**

## watched_history_page()
**Renders the watched history page of the user**

## get_watched_history()
**Gets the watched history of the user**

## remove_from_watched_history()
**Removes a movie from the watched history of the user**

## delete_watchlist_data()
**Removes a movie from the watched list of the user**

## [utils.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/src/recommenderapp/utils.py)

### create_colored_tags(genres)

**Utility function to create colored tags for different movie genres**<br/>
**Input: Movie genres;<br/> Output: Colored tags for those genres**

### beautify_feedback_data(data)

**Utility function to beautify the feedback json containing predicted movies for sending in email**<br/>
**Input: Data obtained from frontend in json format;<br/> Output: Beautified data dictionary containing movies grouped by watchlist category**

### create_movie_genres(movie_genre_df)

**Utility function for creating a dictionary for movie-genres mapping**<br/>
**Input: Data frame of movies.csv;<br/> Output: Dictionary of movies-genres mapping**

### send_email_to_user(recipient_email, categorized_data)

**Utility function to send movie recommendations to user over email**<br/>
**Input : email of recipient_email and output of [beautify_feedback_data](https://github.com/brwali/PopcornPicks/blob/master/docs/backend.md#beautify_feedback_datadata);<br/> Output: Sends email for valid email, otherwise raises exception in the server logs**<br/>

### create_account(db, email, username, password)

**Utility function for creating an account**<br/>
**Input : database handle, email, username, password;<br/> Output: Enters user data into database**<br/>

### add_friend(db, username, user_id)

**Utility function for adding a friend to an existing account**<br/>
**Input: database handle, username of the friend to be added to the logged in account, user_id of the user account logged in**<br/>
**Result: Enters the ids of the logged in user and friend into the Friends table in the database**<br/>

### login_to_account(db, username, password)

**Utility function for logging into an user account**<br/>
**Input: database handle, id of the user account, movie title, score out of ten, and a written review**<br/>
**Result: adds a row to the Ratings table in the database detailing this movie review**<br/>

### submit_review(db, user, movie, score, review)

**Utility function for submitting a movie review**<br/>
**Input: database handle, username of the user account, password of the user account**<br/>
**Output: returns the id of the logged in user if successful otherwise reports an error to the log**<br/>

### get_wall_posts(db)

**Utility function for getting wall posts from the db**<br/>
**Input: database handle**<br/>
**Output: returns the recent movies and their data**<br/>

### get_recent_movies(db, user)

**Utility function for getting recent movies of logged-in user**<br/>
**Input : database handle, user_id**<br/>
**Output: Movies names from most five most recent results of ratings from the logged-in user**<br/>

### get_username(db, user)

**Utility function for getting the username of a user based on the inputted id**<br/>
**Input: database handle, user_id of the user logged in**<br/>
**Output: returns the username stored in the database for that corresponding id**<br/>

### get_recent_friend_movies(db, user)

**Utility function for getting recent movies of a specific user**<br/>
**Input : database handle, user_id**<br/>
**Output: Movies names from most five most recent results of ratings from the specified user**<br/>

### get_friends(db, user)

**Utility function for getting all friends of a logged in user**<br/>
**Input: database handle, user_id of the user logged in**<br/>
**Output: returns a list of all the friends of the user stored in the database**<br/>

### def get_username_data(db, user)

**Utility function to get the user name of a userId**<br/>
**Input: database handle, user_id of the user logged in**<br/>
**Output: returns the userName of the provided User Id**<br/>

### def add_to_watched_history(db, user, movie, watched_date)

**Utility function to add a movie to the watched history of a user**<br/>
**Input: database handle, user_id of the user logged in, movie_id of the movie to be added, date on which the movie was watched**<br/>
**Output: returns true for the movie has been successfully added, false for failed**<br/>

### def remove_from_watched_history_util(db, user_id, imdb_id)

**Utility function to remove a movie from the watched history of a user**<br/>
**Input: database handle, user_id of the user logged in, imdb_id of the movie to be removed**<br/>
**Output: returns true for the movie has been successfully removed, false for failed**<br/>

### def create_or_update_discussion(db, data)

**Utility function to add a comment to a new discussion or create a new discussion for a movie**<br/>
**Input: database handle, data containing the commend imdb_id of the movie and the user who is adding the comment**<br/>
**Output: returns the newly added comment back or error other wise**<br/>

### def get_discussion(db, imdb_id)

**Utility function to get the discussion forum for a movie**<br/>
**Input: database handle, imdb_id of the movie whose discussion is required**<br/>
**Output: returns the discussion forum already present or empty array incase it doesnt exist**<br/>

### def remove_from_watchlist(db, user_id, imdb_id)

**Utility function to delete the movie from the watch list**<br/>
**Input: database handle, user_id of the user logged in, imdb_id of the movie whose discussion is required**<br/>
**Output: returns the deleted idMovies and success message if present or None and doesnt exist message**<br/>

## [search.py](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/src/recommenderapp/search.py)

**Class that handles the search feature of the landing page.**

### starts_with(word)

**Function to check movie prefix**<br/>
**Input : word/initial character(s);<br/> Output : List of movies having that prefix**<br/>

### anywhere(word, visited_words)

**Function to check visited words**<br/>
**Input : Word and visited words;<br/> Output : Words that have not been visited**<br/>

### results(word)

**Function to serve the result render**
**Input : A word/initial character(s);<br/> Output : All titles starting with the given prompt.**<br/>

### results_top_ten(word)

**Function to get top 10 results**
**Input : A word/initial character(s);<br/> Output : Top 10 titles starting with the given prompt (taken from [results](https://github.com/CSC510-Group13/BingeSuggest/blob/v7.0/docs/backend.md#resultsword))**<br/>

## Item_based.py

**Recommends movies to a user based on their past preferences and the preferences of users with similar tastes. Item-Item Collaborative Filtering (CF) is used to recommend similar movies based on user input. For example, if Joseph enjoyed Seven and Shutter Island, PopcornPicks might suggest The Prestige and Inception.**

### recommend_for_new_user(user_rating)

**Generates a list of recommended movie titles for a new user based on their selections via item-item based CF.**
