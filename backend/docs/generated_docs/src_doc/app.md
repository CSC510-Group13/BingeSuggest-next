# Table of Contents

* [app](#app)
  * [login\_page](#app.login_page)
  * [profile\_page](#app.profile_page)
  * [wall\_page](#app.wall_page)
  * [review\_page](#app.review_page)
  * [landing\_page](#app.landing_page)
  * [search\_page](#app.search_page)
  * [predict](#app.predict)
  * [search](#app.search)
  * [create\_acc](#app.create_acc)
  * [signout](#app.signout)
  * [login](#app.login)
  * [friend](#app.friend)
  * [guest](#app.guest)
  * [review](#app.review)
  * [wall\_posts](#app.wall_posts)
  * [recent\_movies](#app.recent_movies)
  * [recent\_friend\_movies](#app.recent_friend_movies)
  * [username](#app.username)
  * [get\_friend](#app.get_friend)
  * [feedback](#app.feedback)
  * [send\_mail](#app.send_mail)
  * [success](#app.success)
  * [before\_request](#app.before_request)
  * [after\_request](#app.after_request)

<a id="app"></a>

# app

Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks

<a id="app.login_page"></a>

#### login\_page

```python
@app.route("/")
def login_page()
```

Renders the login page.

<a id="app.profile_page"></a>

#### profile\_page

```python
@app.route("/profile")
def profile_page()
```

Renders the login page.

<a id="app.wall_page"></a>

#### wall\_page

```python
@app.route("/wall")
def wall_page()
```

Renders the wall page.

<a id="app.review_page"></a>

#### review\_page

```python
@app.route("/review")
def review_page()
```

Renders the review page.

<a id="app.landing_page"></a>

#### landing\_page

```python
@app.route("/landing")
def landing_page()
```

Renders the landing page.

<a id="app.search_page"></a>

#### search\_page

```python
@app.route("/search_page")
def search_page()
```

Renders the search page.

<a id="app.predict"></a>

#### predict

```python
@app.route("/predict", methods=["POST"])
def predict()
```

Predicts movie recommendations based on user ratings.

<a id="app.search"></a>

#### search

```python
@app.route("/search", methods=["POST"])
def search()
```

Handles movie search requests.

<a id="app.create_acc"></a>

#### create\_acc

```python
@app.route("/", methods=["POST"])
def create_acc()
```

Handles creating a new account

<a id="app.signout"></a>

#### signout

```python
@app.route("/out", methods=["POST"])
def signout()
```

Handles signing out the active user

<a id="app.login"></a>

#### login

```python
@app.route("/log", methods=["POST"])
def login()
```

Handles logging in the active user

<a id="app.friend"></a>

#### friend

```python
@app.route("/friend", methods=["POST"])
def friend()
```

Handles adding a new friend

<a id="app.guest"></a>

#### guest

```python
@app.route("/guest", methods=["POST"])
def guest()
```

Sets the user to be a guest user

<a id="app.review"></a>

#### review

```python
@app.route("/review", methods=["POST"])
def review()
```

Handles the submission of a movie review

<a id="app.wall_posts"></a>

#### wall\_posts

```python
@app.route("/getWallData", methods=["GET"])
def wall_posts()
```

Gets the posts for the wall

<a id="app.recent_movies"></a>

#### recent\_movies

```python
@app.route("/getRecentMovies", methods=["GET"])
def recent_movies()
```

Gets the recent movies of the active user

<a id="app.recent_friend_movies"></a>

#### recent\_friend\_movies

```python
@app.route("/getRecentFriendMovies", methods=["POST"])
def recent_friend_movies()
```

Gets the recent movies of a certain friend

<a id="app.username"></a>

#### username

```python
@app.route("/getUserName", methods=["GET"])
def username()
```

Gets the username of the active user

<a id="app.get_friend"></a>

#### get\_friend

```python
@app.route("/getFriends", methods=["GET"])
def get_friend()
```

Gets the friends of the active user

<a id="app.feedback"></a>

#### feedback

```python
@app.route("/feedback", methods=["POST"])
def feedback()
```

Handles user feedback submission and mails the results.

<a id="app.send_mail"></a>

#### send\_mail

```python
@app.route("/sendMail", methods=["POST"])
def send_mail()
```

Handles user feedback submission and mails the results.

<a id="app.success"></a>

#### success

```python
@app.route("/success")
def success()
```

Renders the success page.

<a id="app.before_request"></a>

#### before\_request

```python
@app.before_request
def before_request()
```

Opens the db connection.

<a id="app.after_request"></a>

#### after\_request

```python
@app.after_request
def after_request(response)
```

Closes the db connection.

