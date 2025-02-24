# Table of Contents

* [search](#search)
  * [Search](#search.Search)
    * [starts\_with](#search.Search.starts_with)
    * [anywhere](#search.Search.anywhere)
    * [results](#search.Search.results)
    * [results\_top\_ten](#search.Search.results_top_ten)

<a id="search"></a>

# search

Copyright (c) 2023 Aditya Pai, Ananya Mantravadi, Rishi Singhal, Samarth Shetty
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks

<a id="search.Search"></a>

## Search Objects

```python
class Search()
```

Search feature for landing page

<a id="search.Search.starts_with"></a>

#### starts\_with

```python
def starts_with(word)
```

Function to check movie prefix

<a id="search.Search.anywhere"></a>

#### anywhere

```python
def anywhere(word, visited_words)
```

Function to check visited words

<a id="search.Search.results"></a>

#### results

```python
def results(word)
```

Function to serve the result render

<a id="search.Search.results_top_ten"></a>

#### results\_top\_ten

```python
def results_top_ten(word)
```

Function to get top 10 results

