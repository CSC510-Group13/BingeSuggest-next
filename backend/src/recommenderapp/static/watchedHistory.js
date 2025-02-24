/**
 * Copyright (c) 2023 Nathan Kohen, Nicholas Foster, Brandon Walia, Robert Kenney
 * This code is licensed under MIT license (see LICENSE for details)
 *
 * @author: PopcornPicks
 */

// Fetch and render watched history when the page loads
$(document).ready(async function () {
    try {
        const watchedMovies = await loadWatchedHistory();
        renderWatchedHistory(watchedMovies);
    } catch (error) {
        console.error("Error loading watched history:", error);
    }
});

// Load watched history from the backend
function loadWatchedHistory() {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: "/getWatchedHistoryData",
            contentType: "application/json;charset=UTF-8",
            success: function (response) {
                console.log("Watched History Data:", response); // Debugging log
                resolve(response);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}

// Render watched history posts
async function renderWatchedHistory(watchedMovies) {
    const container = $("#watchedHistoryContainer");

    for (const movie of watchedMovies) {
        const movieDiv = $("<div>").addClass("movie-entry row mb-3 p-2 border-bottom");

        // Fetch metadata from OMDb API
        let movieData = {};
        try {
            movieData = await fetchMovieData(movie.imdb_id);
        } catch (error) {
            console.error("Error fetching movie data:", error);
        }

        // Movie Poster
        const posterDiv = $("<div>").addClass("col-md-2");
        const posterImg = $("<img>", {
            src: movieData.Poster || "placeholder.png",
            alt: "Poster not available",
            style: "width: 100%;",
        });
        posterDiv.append(posterImg);

        // Movie Details
        const detailsDiv = $("<div>").addClass("col-md-6");
        const title = $("<h5>").text(movieData.Title || movie.movie_name);
        const watchedOn = $("<p>").text(`Watched on: ${movie.watched_date}`);
        const genres = $("<p>").text(`Genres: ${movieData.Genre || "N/A"}`);
        detailsDiv.append(title, watchedOn, genres);

        // Action Buttons (IMDb and Delete)
        const actionDiv = $("<div>").addClass("col-md-4 text-right");
        const imdbLink = $("<a>", {
            href: `https://www.imdb.com/title/${movie.imdb_id}`,
            target: "_blank",
            class: "btn btn-info btn-sm mr-2",
        }).text("IMDb");
        const deleteButton = $("<button>")
            .addClass("btn btn-danger btn-sm")
            .text("Delete")
            .click(async function () {
                const confirmed = confirm(
                    `Are you sure you want to remove "${movieData.Title || movie.movie_name}" from your watched history?`
                );
                if (confirmed) {
                    try {
                        const response = await $.ajax({
                            type: "POST",
                            url: "/removeFromWatchedHistory",
                            contentType: "application/json;charset=UTF-8",
                            data: JSON.stringify({ imdb_id: movie.imdb_id }),
                        });
                        alert(response.message);
                        movieDiv.remove(); // Remove the entry from the DOM
                    } catch (error) {
                        console.error("Error deleting movie:", error);
                        alert("Failed to delete the movie. Please try again.");
                    }
                }
            });
        actionDiv.append(imdbLink, deleteButton);

        // Append all components to the movie entry
        movieDiv.append(posterDiv, detailsDiv, actionDiv);
        container.append(movieDiv);
    }
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

// Fetch movie metadata from OMDb API
function fetchMovieData(imdbID) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "GET",
            url: "http://www.omdbapi.com/",
            dataType: "json",
            data: {
                i: imdbID,
                apikey: apiKey,
            },
            success: function (response) {
                resolve(response);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
