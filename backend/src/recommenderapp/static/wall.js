/**
Copyright (c) 2023 Nathan Kohen, Nicholas Foster, Brandon Walia, Robert Kenney
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks
 */
// Function to handle Get Started button click
function backToLandingPage() {
    // Navigate to the search page
    $("#loaderLanding").attr("class", "d-flex justify-content-center");
    $(".container").hide();
    $("#post-container").hide();
    setTimeout(function () {
        window.location.href = "/landing" // Replace with the actual URL of your search page
    }, 2000);
}

// Bind the getStarted function to the Get Started button click
$("#backToLanding").click(function () {
    backToLandingPage();
});


posts = []

function loadPosts(){

    return new Promise(function(resolve, reject){
        $.ajax({
            type: 'GET',
            url: '/getWallData',
            contentType: "application/json;charset=UTF-8",
            success: function(response) {
                console.log(response)
                resolve(response)
            },
            error: function(error) {
                reject(error);
            }
            });
        });
}

let apiKey = "";

async function fetchApiKey() {
    try {
        const response = await fetch("/get_api_key");
        const data = await response.json();
        if (data.apikey) {
            apiKey = data.apikey; // Assign the API key
        } else {
            console.error("Failed to fetch API key:", data.error);
        }
    } catch (error) {
        console.error("Error fetching API key:", error);
    }
}

fetchApiKey();

function fetchMovieData(imdbID){
    return new Promise(function(resolve, reject){
        $.ajax({
            type: 'GET',
            url: 'http://www.omdbapi.com/',
            dataType: 'json',
            data: {
                i: imdbID,
                apikey: apiKey,
            },
            success: function(response) {
                resolve(response);
            },
            error: function(error) {
                reject(error);
            }
            });
        });
}

async function renderPosts() {
    const postContainer = $('#post-container');

    posts.forEach(post => buildPost(post, postContainer));
}

async function buildPost(post, postContainer){

    var postDiv = $('<div>').addClass('post');

    var imageDiv = $('<div>');
    var userDiv = $('<div>');
    
    var movieData;
    try{
        movieData = await fetchMovieData(post.imdb_id);
    } catch(error){
        console.error(error);
    }
    
    var image = $('<img>', {src: movieData.Poster, alt: 'Image not found', style: 'width:100px;'})

    var titleDiv = $('<div>').addClass('postTitle');

    var usernameDiv = $('<div>').addClass('username').text(post.username);

    var postTitleText = $('<div>').addClass('postTitleText').text('reviewed');

    var movieNameDiv = $('<div>').addClass('moviename').text(movieData.Title);

    titleDiv.append(usernameDiv, postTitleText, movieNameDiv);

    var reviewDiv = $('<div>').addClass('review');

    for(let i = 0; i < post.score; i++){
        var star = $('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>');
        reviewDiv.append(star);
    }

    var halfStar = $('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16"><path d="M5.354 5.119 7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.548.548 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.52.52 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.58.58 0 0 1 .085-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.565.565 0 0 1 .162-.505l2.907-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.001 2.223 8 2.226v9.8z"/></svg>');
    if((post.score * 10) % 10 > 0){
        reviewDiv.append(halfStar);
    }

    var commentDiv = $('<div>').addClass('comment').text(post.review);

 
    var dataDiv = $('<div>').addClass('movie-data');

    var ratedDiv = $('<div>').text(movieData.Rated);
    var yearDiv = $('<div>').text(movieData.Year);
    var genreDiv = $('<div>').text(movieData.Genre);
    var runtimeDiv = $('<div>').text(movieData.Runtime);

    dataDiv.append(ratedDiv, yearDiv, genreDiv, runtimeDiv);

    imageDiv.append(image);
    userDiv.append(titleDiv, reviewDiv, commentDiv);
    postDiv.append(imageDiv, userDiv, dataDiv);
    postContainer.append(postDiv);
}

var loaded = false;

$(document).ready(async function () {
    if(!loaded){
        loaded = true;
        try{
            posts = await loadPosts();
        } catch(error){
            console.error(error);
        }
        renderPosts();
    }
});