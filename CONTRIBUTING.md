## Contributing:

* If you would like to contribute and collaborate with this repository, then please inform us through email at dashytisbest@gmail.com.

## Purpose of Contributing:

* To develop our product and take it to the next level.
* To enhance the already existing feature.
* To make the product more efficient.
* To resolve critical bugs encountered.
* Helping the community by delivering a better product.
* Help us find solutions to computationally/memory-intensive processes
* Help us to scale the system to a larger database
* To run the email notifier feature - make your own Gmail account and password and replace the same in the utils.py(function: send_email_to_user(recipient_email, categorized_data))

## Our Table Of Contents

- .github/workflows  
  - all GitHub workflow YAML files
    
- proj3  
   - README.md
   - Proj3Changes.md
     
- src  
  - prediction_scripts    
     - item_based.py   
  - recommenderapp
    - static
      - script.js
      - stylesheet.css
      - wall.js
      - watchlist.js
    - templates
      - landing_page.html
      - login.html
      - navbar.html
      - profile.html
      - review.html
      - search_page.html
      - success.html
      - wall.html
      - watchlist.html
    - app.py
    - data.py
    - search.py
    - utils.py
  - init.sql
  - movies.sql
  
- test  
    - test_predict.py  
    - test_search.py  
    - test_util.py
- test_v7 
  - das    
     - test_DB.py
     - test_predict_actor.py
     - test_predict_all.py
     - test_predict_director.py
     - test_predict_genre.py
     - test_search.py
     - test_watchlist.py
  - sap    
     - test_DB.py
     - test_email_content.py
     - test_predict_actor.py
     - test_predict_all.py
     - test_predict_director.py
     - test_predict_genre.py
     - test_search.py
     - test_watchlist.py
  - vsr    
     - test_DB.py
     - test_predict_actor.py
     - test_predict_all.py
     - test_predict_director.py
     - test_predict_genre.py
     - test_search.py
  - watchedHistory
     - test_add_to_watched_history.py
     - test_remove_from_watched_history.py
  - watchList
     - test_add_to_watch_list.py
     - test_drop_watch_list.py
  
- .gitignore

- CHAT.md

- CITATION.md

- CODE_OF_CONDUCT.md

- CONTRIBUTING.md

- Dependencies.md

- LICENSE

- README.md

- requirements.txt

- setup.py

## Suggesting Enhancements

Any suggested enhancements like adding new features or improving existing functionalities, etc can done by following the below guidelines. They help maintainers understand your improvement. <br>
[the template](https://github.com/atom/.github/blob/master/.github/ISSUE_TEMPLATE/feature_request.md)- this template is to be filled to add suggestions. These can include the steps that you imagine you would take if the feature you're requesting existed.

##### Before Submitting An Enhancement Suggestion

[debugging guide](https://flight-manual.atom.io/hacking-atom/sections/debugging/). Check out this debugging guide, which helps you to find the cause of the problem and you may fix it by yourself manually. <br>
[cursory search](https://github.com/search?q=+is%3Aissue+user%3Aatom) A cursory search is necessary to check if the reported bug has already been mentioned before or not. You can add to the existing bug report if the issue is still open.

#### To Submit A Good Enhancement Suggestion

[GitHub issues](https://guides.github.com/features/issues/) You can track the bugs from this. For the repository that has a bug, create an issue and fill out [the template](https://github.com/atom/.github/blob/master/.github/ISSUE_TEMPLATE/bug_report.md) to give details of the bug.

* To identify the problem, give the issue a clear and informative term. <br>
* Describe in as much detail as possible to duplicate the problem. Explain the problem and explain the exact command used in the terminal that caused the bug to occur.
* To demonstrate the steps, give specific examples. Include links to files or GitHub projects, or copy/pasteable snippets, which you use in those examples. If you're providing snippets in the issue, use [Markdown code blocks](https://help.github.com/articles/markdown-basics/#multiple-lines).
* Specify the problem behavior that you expected to see and why.
* If possible, include screenshots and animated GIFs that clearly demonstrate the problem. [this tool](https://www.cockos.com/licecap/)- to record GIFs on macOS and Windows, and [this tool](https://github.com/colinkeenan/silentcast) or [this tool](https://github.com/GNOME/byzanz) on Linux.
* To include a crash report, add a stack trace from the operating system. For macOS, `Console.app` under "Diagnostic and usage information" > "User diagnostic reports" has the crash report. Include the crash report in the issue in a [code block](https://help.github.com/articles/markdown-basics/#multiple-lines), a [file attachment](https://help.github.com/articles/file-attachments-on-issues-and-pull-requests/), or put it in a [gist](https://gist.github.com/) and provide link to that gist.
* For performance or memory issues, include a [CPU profile capture](https://flight-manual.atom.io/hacking-atom/sections/debugging/#diagnose-runtime-performance) with your report.

#### Start Your Contribution

`beginner` and `help-wanted` issues can help you get started to making your first contribution:

* [Beginner issues][beginner] - issues which should only require a few lines of code, and a test or two.
* [Help wanted issues][help-wanted] - issues that should be a bit more involved than `beginner` issues.

## Style checkers standards:
* Use the `pylance` package for Python (VS code), and use `black` for auto-styling and auto-formatting the code.
* Use 'pylint' for proper coding standards

## Code of Conduct:

* Please go through the [Code of Conduct](https://github.com/svd-ncsu/BingeSuggest/blob/v6.0/CODE_OF_CONDUCT.md`) before you begin contributing. This project and everyone participating in it is governed by the Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to dashytisbest@gmail.com.

## Pull Request Submission Guidelines

* Installing Git makes contributing to the repository easier
* To start contributing to the repository make sure you fork the repository first
* Create a new branch to develop the project 
* Write code to contribute and commit to create a pull request.
* Pass all the test cases that we have mentioned in the test folder and ensure the code passes the workflow checks.
* One of the repository administrators will review the pull request and merge the changes.

## Code Style Guide 

* Python language(Version 3.x) has been used to build this project repository
* Make sure to add the functionalities in the form of modules
* Any code that is not tested should be committed to the test codes in the code folder. After they are successfully tested, the  main code can be updated.
* Variable names should be self-explanatory
* Add comments in the code so that a new contributor can understand the functionality of the modules easily
* `black` is used as linter
* 'Pylint' used for proper coding standards

## Governal Policies

All contributions will be carefully reviewed by our entire development team. We will discuss the advantages and disadvantages of adding the change, and a final decision will be decided based on a vote, with all members' votes having equal weight.
