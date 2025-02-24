# Table of Contents

* [utils](#utils)
  * [create\_colored\_tags](#utils.create_colored_tags)
  * [beautify\_feedback\_data](#utils.beautify_feedback_data)
  * [create\_movie\_genres](#utils.create_movie_genres)
  * [send\_email\_to\_user](#utils.send_email_to_user)
  * [create\_account](#utils.create_account)
  * [add\_friend](#utils.add_friend)
  * [login\_to\_account](#utils.login_to_account)
  * [submit\_review](#utils.submit_review)
  * [get\_wall\_posts](#utils.get_wall_posts)
  * [get\_recent\_movies](#utils.get_recent_movies)
  * [get\_username](#utils.get_username)
  * [get\_recent\_friend\_movies](#utils.get_recent_friend_movies)
  * [get\_friends](#utils.get_friends)

<a id="utils"></a>

# utils

Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks

<a id="utils.create_colored_tags"></a>

#### create\_colored\_tags

```python
def create_colored_tags(genres)
```

Utitilty function to create colored tags for different
movie genres

<a id="utils.beautify_feedback_data"></a>

#### beautify\_feedback\_data

```python
def beautify_feedback_data(data)
```

Utility function to beautify the feedback json containing predicted movies for sending in email

<a id="utils.create_movie_genres"></a>

#### create\_movie\_genres

```python
def create_movie_genres(movie_genre_df)
```

Utility function for creating a dictionary for movie-genres mapping

<a id="utils.send_email_to_user"></a>

#### send\_email\_to\_user

```python
def send_email_to_user(recipient_email, categorized_data)
```

Utility function to send movie recommendations to user over email

<a id="utils.create_account"></a>

#### create\_account

```python
def create_account(db, email, username, password)
```

Utility function for creating an account

<a id="utils.add_friend"></a>

#### add\_friend

```python
def add_friend(db, username, user_id)
```

Utility function for adding a friend

<a id="utils.login_to_account"></a>

#### login\_to\_account

```python
def login_to_account(db, username, password)
```

Utility function for logging in to an account

<a id="utils.submit_review"></a>

#### submit\_review

```python
def submit_review(db, user, movie, score, review)
```

Utility function for creating a dictionary for submitting a review

<a id="utils.get_wall_posts"></a>

#### get\_wall\_posts

```python
def get_wall_posts(db)
```

Utility function for creating getting wall posts from the db

<a id="utils.get_recent_movies"></a>

#### get\_recent\_movies

```python
def get_recent_movies(db, user)
```

Utility function for getting recent movies reviewed by a user

<a id="utils.get_username"></a>

#### get\_username

```python
def get_username(db, user)
```

Utility function for getting the current users username

<a id="utils.get_recent_friend_movies"></a>

#### get\_recent\_friend\_movies

```python
def get_recent_friend_movies(db, user)
```

Utility function for getting a certain users id

<a id="utils.get_friends"></a>

#### get\_friends

```python
def get_friends(db, user)
```

Utility function for getting the current users friends

