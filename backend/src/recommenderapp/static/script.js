/**
Copyright (c) 2023 Nathan Kohen, Nicholas Foster, Brandon Walia, Robert Kenney
This code is licensed under MIT license (see LICENSE for details)

@author: PopcornPicks
 */
$(document).ready(function () {
	$(function () {
		$("#searchBox").autocomplete({
			source: function (request, response) {
				$.ajax({
					type: "POST",
					url: "http://localhost:5000/search",
					dataType: "json",
					cache: false,
					data: {
						q: request.term,
					},
					success: function (data) {
						response(data)
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(textStatus + " " + errorThrown)
					},
				})
			},
			select: function (event, ui) {
				console.log(ui.item);
			
				var ulList = $("#selectedMovies");
			
				// Check if the movie is already in the list
				if (ulList.find('li:contains("' + ui.item.value + '")').length > 0) {
					$("#searchBox").val("");
					return false;
				}
			
				// Store the selected movie details in hidden fields
				$("#movieName").val(ui.item.value);    // Movie name
				$("#imdbID").val(ui.item.imdb_id);     // IMDb ID (assuming ui.item has an imdb_id property)
			
				// Create list item for the selected movie with a close button
				var li = $("<li class='list-group-item d-flex justify-content-between align-items-center'/>")
					.text(ui.item.value)
					.append(
						$("<button class='btn-close' aria-label='Close'></button>")
							.on("click", function () {
								$(this).parent().remove(); // Remove the movie from the list
								// Clear the hidden fields when the movie is removed
								$("#movieName").val("");
								$("#imdbID").val("");
							})
					)
					.appendTo(ulList);
			
				// Clear the search box after selection
				$("#searchBox").val("");
				return false;
			},
			// changed the min-length for searching movies from 2 to 1
			minLength: 1,
		})
		

		$("#searchBoxWatchlist").autocomplete({
			source: function (request, response) {
				$.ajax({
					type: "POST",
					url: "http://localhost:5000/search",
					dataType: "json",
					cache: false,
					data: {
						q: request.term,
					},
					success: function (data) {
						response(data)
					},
					error: function (jqXHR, textStatus, errorThrown) {
						console.log(textStatus + " " + errorThrown)
					},
				})
			},
			select: function(event, ui) {
				// Set the input field value to the selected item
				$("#searchBoxWatchlist").val(ui.item.label); // assuming `label` is the property you want to display
				//$("#imdbID").val(ui.item.imdb_id); // Set the hidden IMDb ID field value
				$("#movieName").val(ui.item.value);
				console.log(ui.item.label)
				console.log(ui.item);
				return false; // Prevent the default behavior
			  },
			// changed the min-length for searching movies from 2 to 1
			minLength: 1,
		});

		$("#addButton").off("click").click(function() {
			//const imdbID = $("#imdbID").val();
			const movieName= $("#searchBoxWatchlist").val();
			if (movieName) {
			  // Send a POST request to the server to add the movie to the watchlist
			  $.ajax({
				type: "POST",
				url: "http://localhost:5000/add_to_watchlist",
				contentType: "application/json",
				data: JSON.stringify({ movieName:movieName }),
				success: function(response) {
				  alert(response.message); // Display the server's response message
				  location.reload();
				},
				info: function(response) {
					alert(response.message); // Display the server's response message
					location.reload();
				  },
				error: function(jqXHR, textStatus, errorThrown) {
				  console.error("Error adding movie:", textStatus, errorThrown);
				  alert("An error occurred. Please try again.");
				}
			  });
			} else {
			  alert("Please select a movie from the search suggestions.");
			}
		  });
	})

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

	$(document).on("click", "#genreBased", function() {
		$("#loader").attr("class", "d-flex justify-content-center")

		var movie_list = []

		$("#selectedMovies li").each(function () {
			movie_list.push($(this).text())
		})

		var movies = { movie_list: movie_list }

		// Clear the existing recommendations
		$("#predictedMovies").empty()
		$("#predictedMovies2").empty()

		// if movies list empty then throw an error box saying select atleast 1 movie!!
		if (movie_list.length == 0) {
			alert("Select atleast 1 movie!!")
		}

		$.ajax({
			type: "POST",
			url: "/genreBased",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(movies),
			success: async function (response) {
				var ulList = $("#predictedMovies")
				var i = 0
				var recommendations = response["recommendations"]
				var imdbIds = response["imdb_id"]
				for (var i = 0; i < recommendations.length; i++) {
					if(i>=5){
					ulList = $("#predictedMovies2")
					}
					
					var element = recommendations[i]
					var imdbID = imdbIds[i]
					var diventry = $("<div class=\"listItem\" />")
					var fieldset = $("<fieldset/>", { id: i }).css("border", "0")
					var link = $("<a/>")
						.text("IMDb🔗")
						.css({ "text-decoration": "none" })
						.attr("href", "https://www.imdb.com/title/" + imdbID)
					var li = $("<li/>")
					var a = $("<a />").text(element)
					var movieData;
					try{
						movieData = await fetchMovieData(imdbID);
						a
						.attr("href", 'http://localhost:5000/movie/' + movieData.imdbID)
						.css({ "text-decoration": "none" })	
						li.append(a)
					} catch(error){
						console.error(error);
					}
    				var image = $('<img>', {src: movieData.Poster, alt: 'Image not found', style: 'width:150px; height:220px'})				
					var radios = $(`
                    <table class='table predictTable'>
                      <tr >
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'😍'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='3' data-toggle="tooltip" data-placement="top" title="LIKE" >
              				<span >Like</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'🤔'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='2' data-toggle="tooltip" data-placement="top" title="YET TO WATCH">
							
              				<span style="margin-right:40px;">Yet&nbsp;To&nbsp;Watch</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'☹️'; display: flex; align-items: center; justify-content: center; "><input type="radio" name="${i}" value='1' data-toggle="tooltip" data-placement="top" title="DISLIKE">
							
              			<span >Dislike</span>
							</label>
                          </section>
                        </td>
                      </tr>
                    </table>
                  `)

				  var watchlistButton = $("<button/>")
				  .text("Add to Watchlist")
				  .attr("data-imdb-id", imdbID)
				  .addClass("btn btn-secondary btn-sm") // Optional styling for consistency
				  .click(function (event) {
					  event.preventDefault();
					  var imdb_id = $(this).data("imdb-id");
					  var button = $(this);
					  $.ajax({
						  type: "POST",
						  url: "/add_to_watchlist",
						  dataType: "json",
						  contentType: "application/json;charset=UTF-8",
						  data: JSON.stringify({ imdb_id: imdb_id }),
						  success: function (response) {
							  alert(response.message);
							  button.text("Added").prop("disabled", true);
						  },
						  error: function (error) {
							  console.log("ERROR ->" + error);
						  }
					  });
				  });

					var watchedHistoryButton = $("<button/>")
    				.text("Add to Watched History")
    				.attr("data-imdb-id", imdbID)
    				.addClass("btn btn-primary btn-sm") // Optional styling for consistency
    				.click(function (event) {
        				event.preventDefault();
        				var imdb_id = $(this).data("imdb-id");
        				var button = $(this);
        				$.ajax({
            				type: "POST",
            				url: "/add_to_watched_history",
            				dataType: "json",
            				contentType: "application/json;charset=UTF-8",
            				data: JSON.stringify({ imdb_id: imdb_id }),
            				success: function (response) {
                				alert(response.message);
                				button.text("Added to History").prop("disabled", true);
            				},
            					error: function (error) {
                				console.error("Error adding to watched history:", error);
                				alert("An error occurred. Please try again.");
            				}
        				});
    				});
					var tableLayout = $("<table cellspacing='0' cellpadding='0' width='100%' />");
					var row = $("<tr />");
					var leftColumn = $("<td width='80%' />").append(li).append(link).append(radios).append(watchlistButton).append(watchedHistoryButton);// Radio buttons and Watchlist button in the left column
					var rightColumn = $("<td width='20%' />").append(image); // Image in the right column

					row.append(leftColumn).append(rightColumn);
					tableLayout.append(row);

					// diventry.append(li)
					// diventry.append(link)
					diventry.append(tableLayout)
					// diventry.append(image)
					// diventry.append(watchlistButton)
					fieldset.append(diventry)
					ulList.append(fieldset)
				}

				$("#recommendedMoviesSection").removeClass("d-none");
				$(".feedbackDiv").removeClass("d-none");
				$("#loader").attr("class", "d-none")

				
				$("html, body").animate({
					scrollTop: $("#recommendedMoviesSection").offset().top-60
				}, 800) // duration of 1 second (1000 ms)
			},
			error: function (error) {
				console.log("ERROR ->" + error)
				$("#loader").attr("class", "d-none")
			},
		})
	})

	$(document).on("click", "#dirBased", function() {
		$("#loader").attr("class", "d-flex justify-content-center")

		var movie_list = []

		$("#selectedMovies li").each(function () {
			movie_list.push($(this).text())
		})

		var movies = { movie_list: movie_list }

		// Clear the existing recommendations
		$("#predictedMovies").empty()
		$("#predictedMovies2").empty()


		// if movies list empty then throw an error box saying select atleast 1 movie!!
		if (movie_list.length == 0) {
			alert("Select atleast 1 movie!!")
		}

		$.ajax({
			type: "POST",
			url: "/dirBased",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(movies),
			success: async function (response) {
				var ulList = $("#predictedMovies")
				var i = 0
				var recommendations = response["recommendations"]
				var imdbIds = response["imdb_id"]
				for (var i = 0; i < recommendations.length; i++) {
					if(i>=5){
					ulList = $("#predictedMovies2")
					}
					
					var element = recommendations[i]
					var imdbID = imdbIds[i]
					var diventry = $("<div class=\"listItem\" />")
					var fieldset = $("<fieldset/>", { id: i }).css("border", "0")
					var link = $("<a/>")
						.text("IMDb🔗")
						.css({ "text-decoration": "none" })
						.attr("href", "https://www.imdb.com/title/" + imdbID)
					var li = $("<li/>")
					var a = $("<a />").text(element)
					var movieData;
					try{
						movieData = await fetchMovieData(imdbID);
						a
						.attr("href", 'http://localhost:5000/movie/' + movieData.imdbID)
						.css({ "text-decoration": "none" })	
						li.append(a)
					} catch(error){
						console.error(error);
					}
    				var image = $('<img>', {src: movieData.Poster, alt: 'Image not found', style: 'width:150px; height:220px'})				
					var radios = $(`
                    <table class='table predictTable'>
                      <tr >
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'😍'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='3' data-toggle="tooltip" data-placement="top" title="LIKE" >
              				<span >Like</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'🤔'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='2' data-toggle="tooltip" data-placement="top" title="YET TO WATCH">
							
              				<span style="margin-right:40px;">Yet&nbsp;To&nbsp;Watch</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'☹️'; display: flex; align-items: center; justify-content: center; "><input type="radio" name="${i}" value='1' data-toggle="tooltip" data-placement="top" title="DISLIKE">
							
              			<span >Dislike</span>
							</label>
                          </section>
                        </td>
                      </tr>
                    </table>
                  `)

				  var watchlistButton = $("<button/>")
				  .text("Add to Watchlist")
				  .attr("data-imdb-id", imdbID)
				  .addClass("btn btn-secondary btn-sm") // Optional styling for consistency
				  .click(function (event) {
					  event.preventDefault();
					  var imdb_id = $(this).data("imdb-id");
					  var button = $(this);
					  $.ajax({
						  type: "POST",
						  url: "/add_to_watchlist",
						  dataType: "json",
						  contentType: "application/json;charset=UTF-8",
						  data: JSON.stringify({ imdb_id: imdb_id }),
						  success: function (response) {
							  alert(response.message);
							  button.text("Added").prop("disabled", true);
						  },
						  error: function (error) {
							  console.log("ERROR ->" + error);
						  }
					  });
				  });
                    var watchedHistoryButton = $("<button/>")
    				.text("Add to Watched History")
    				.attr("data-imdb-id", imdbID)
    				.addClass("btn btn-primary btn-sm") // Optional styling for consistency
    				.click(function (event) {
        				event.preventDefault();
        				var imdb_id = $(this).data("imdb-id");
        				var button = $(this);
        				$.ajax({
            				type: "POST",
            				url: "/add_to_watched_history",
            				dataType: "json",
            				contentType: "application/json;charset=UTF-8",
            				data: JSON.stringify({ imdb_id: imdb_id }),
            				success: function (response) {
                				alert(response.message);
                				button.text("Added to History").prop("disabled", true);
            				},
            					error: function (error) {
                				console.error("Error adding to watched history:", error);
                				alert("An error occurred. Please try again.");
            				}
        				});
    				});
					var tableLayout = $("<table cellspacing='0' cellpadding='0' width='100%' />");
					var row = $("<tr />");
					var leftColumn = $("<td width='80%' />").append(li).append(link).append(radios).append(watchlistButton).append(watchedHistoryButton); // Radio buttons and Watchlist button in the left column
					var rightColumn = $("<td width='20%' />").append(image); // Image in the right column

					row.append(leftColumn).append(rightColumn);
					tableLayout.append(row);

					// diventry.append(li)
					// diventry.append(link)
					diventry.append(tableLayout)
					// diventry.append(image)
					// diventry.append(watchlistButton)
					fieldset.append(diventry)
					ulList.append(fieldset)
				}

				$("#recommendedMoviesSection").removeClass("d-none");
				$(".feedbackDiv").removeClass("d-none");
				$("#loader").attr("class", "d-none")

				
				$("html, body").animate({
					scrollTop: $("#recommendedMoviesSection").offset().top-60
				}, 800) // duration of 1 second (1000 ms)
			},
			error: function (error) {
				console.log("ERROR ->" + error)
				$("#loader").attr("class", "d-none")
			},
		})
	})

	$(document).on("click", "#actorBased", function() {
		$("#loader").attr("class", "d-flex justify-content-center")

		var movie_list = []

		$("#selectedMovies li").each(function () {
			movie_list.push($(this).text())
		})

		var movies = { movie_list: movie_list }

		// Clear the existing recommendations
		$("#predictedMovies").empty()
		$("#predictedMovies2").empty()


		// if movies list empty then throw an error box saying select atleast 1 movie!!
		if (movie_list.length == 0) {
			alert("Select atleast 1 movie!!")
		}

		$.ajax({
			type: "POST",
			url: "/actorBased",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(movies),
			success: async function (response) {
				var ulList = $("#predictedMovies")
				var i = 0
				var recommendations = response["recommendations"]
				var imdbIds = response["imdb_id"]
				for (var i = 0; i < recommendations.length; i++) {
					if(i>=5){
					ulList = $("#predictedMovies2")
					}
					
					var element = recommendations[i]
					var imdbID = imdbIds[i]
					var diventry = $("<div class=\"listItem\" />")
					var fieldset = $("<fieldset/>", { id: i }).css("border", "0")
					var link = $("<a/>")
						.text("IMDb🔗")
						.css({ "text-decoration": "none" })
						.attr("href", "https://www.imdb.com/title/" + imdbID)
					var li = $("<li/>")
					var a = $("<a />").text(element)
					var movieData;
					try{
						movieData = await fetchMovieData(imdbID);
						a
						.attr("href", 'http://localhost:5000/movie/' + movieData.imdbID)
						.css({ "text-decoration": "none" })	
						li.append(a)
					} catch(error){
						console.error(error);
					}
    				var image = $('<img>', {src: movieData.Poster, alt: 'Image not found', style: 'width:150px; height:220px'})				
					var radios = $(`
                    <table class='table predictTable'>
                      <tr >
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'😍'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='3' data-toggle="tooltip" data-placement="top" title="LIKE" >
              				<span >Like</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'🤔'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='2' data-toggle="tooltip" data-placement="top" title="YET TO WATCH">
							
              				<span style="margin-right:40px;">Yet&nbsp;To&nbsp;Watch</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'☹️'; display: flex; align-items: center; justify-content: center; "><input type="radio" name="${i}" value='1' data-toggle="tooltip" data-placement="top" title="DISLIKE">
							
              			<span >Dislike</span>
							</label>
                          </section>
                        </td>
                      </tr>
                    </table>
                  `)

				  var watchlistButton = $("<button/>")
				  .text("Add to Watchlist")
				  .attr("data-imdb-id", imdbID)
				  .addClass("btn btn-secondary btn-sm") // Optional styling for consistency
				  .click(function (event) {
					  event.preventDefault();
					  var imdb_id = $(this).data("imdb-id");
					  var button = $(this);
					  $.ajax({
						  type: "POST",
						  url: "/add_to_watchlist",
						  dataType: "json",
						  contentType: "application/json;charset=UTF-8",
						  data: JSON.stringify({ imdb_id: imdb_id }),
						  success: function (response) {
							  alert(response.message);
							  button.text("Added").prop("disabled", true);
						  },
						  error: function (error) {
							  console.log("ERROR ->" + error);
						  }
					  });
				  });
                    var watchedHistoryButton = $("<button/>")
    				.text("Add to Watched History")
    				.attr("data-imdb-id", imdbID)
    				.addClass("btn btn-primary btn-sm") // Optional styling for consistency
    				.click(function (event) {
        				event.preventDefault();
        				var imdb_id = $(this).data("imdb-id");
        				var button = $(this);
        				$.ajax({
            				type: "POST",
            				url: "/add_to_watched_history",
            				dataType: "json",
            				contentType: "application/json;charset=UTF-8",
            				data: JSON.stringify({ imdb_id: imdb_id }),
            				success: function (response) {
                				alert(response.message);
                				button.text("Added to History").prop("disabled", true);
            				},
            					error: function (error) {
                				console.error("Error adding to watched history:", error);
                				alert("An error occurred. Please try again.");
            				}
        				});
    				});
					var tableLayout = $("<table cellspacing='0' cellpadding='0' width='100%' />");
					var row = $("<tr />");
					var leftColumn = $("<td width='80%' />").append(li).append(link).append(radios).append(watchlistButton).append(watchedHistoryButton); // Radio buttons and Watchlist button in the left column
					var rightColumn = $("<td width='20%' />").append(image); // Image in the right column

					row.append(leftColumn).append(rightColumn);
					tableLayout.append(row);

					// diventry.append(li)
					// diventry.append(link)
					diventry.append(tableLayout)
					// diventry.append(image)
					// diventry.append(watchlistButton)
					fieldset.append(diventry)
					ulList.append(fieldset)
				}

				$("#recommendedMoviesSection").removeClass("d-none");
				$(".feedbackDiv").removeClass("d-none");
				$("#loader").attr("class", "d-none")

				
				$("html, body").animate({
					scrollTop: $("#recommendedMoviesSection").offset().top-60
				}, 800) // duration of 1 second (1000 ms)
			},
			error: function (error) {
				console.log("ERROR ->" + error)
				$("#loader").attr("class", "d-none")
			},
		})
	})

	$(document).on("click", "#all", function() {
		$("#loader").attr("class", "d-flex justify-content-center")

		var movie_list = []

		$("#selectedMovies li").each(function () {
			movie_list.push($(this).text())
		})

		var movies = { movie_list: movie_list }

		// Clear the existing recommendations
		$("#predictedMovies").empty()
		$("#predictedMovies2").empty()


		// if movies list empty then throw an error box saying select atleast 1 movie!!
		if (movie_list.length == 0) {
			alert("Select atleast 1 movie!!")
		}

		$.ajax({
			type: "POST",
			url: "/all",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(movies),
			success: async function (response) {
				var ulList = $("#predictedMovies")
				var i = 0
				var recommendations = response["recommendations"]
				var imdbIds = response["imdb_id"]
				for (var i = 0; i < recommendations.length; i++) {
					if(i>=5){
					ulList = $("#predictedMovies2")
					}
					
					var element = recommendations[i]
					var imdbID = imdbIds[i]
					var diventry = $("<div class=\"listItem\" />")
					var fieldset = $("<fieldset/>", { id: i }).css("border", "0")
					var link = $("<a/>")
						.text("IMDb🔗")
						.css({ "text-decoration": "none" })
						.attr("href", "https://www.imdb.com/title/" + imdbID)
					var li = $("<li/>")
					var a = $("<a />").text(element)
					var movieData;
					try{
						movieData = await fetchMovieData(imdbID);
						a
						.attr("href", 'http://localhost:5000/movie/' + movieData.imdbID)
						.css({ "text-decoration": "none" })	
						li.append(a)
					} catch(error){
						console.error(error);
					}
    				var image = $('<img>', {src: movieData.Poster, alt: 'Image not found', style: 'width:150px; height:220px'})				
					var radios = $(`
                    <table class='table predictTable'>
                      <tr >
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'😍'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='3' data-toggle="tooltip" data-placement="top" title="LIKE" >
              				<span >Like</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'🤔'; display: flex; align-items: center; justify-content: center;"><input type="radio" name="${i}" value='2' data-toggle="tooltip" data-placement="top" title="YET TO WATCH">
							
              				<span style="margin-right:40px;">Yet&nbsp;To&nbsp;Watch</span>
							</label>
                          </section>
                        </td>
                        <td class='radio-inline'>
                          <section id="pattern1">
                            <label style="--icon:'☹️'; display: flex; align-items: center; justify-content: center; "><input type="radio" name="${i}" value='1' data-toggle="tooltip" data-placement="top" title="DISLIKE">
							
              			<span >Dislike</span>
							</label>
                          </section>
                        </td>
                      </tr>
                    </table>
                  `)

				  var watchlistButton = $("<button/>")
				  .text("Add to Watchlist")
				  .attr("data-imdb-id", imdbID)
				  .addClass("btn btn-secondary btn-sm") // Optional styling for consistency
				  .click(function (event) {
					  event.preventDefault();
					  var imdb_id = $(this).data("imdb-id");
					  var button = $(this);
					  $.ajax({
						  type: "POST",
						  url: "/add_to_watchlist",
						  dataType: "json",
						  contentType: "application/json;charset=UTF-8",
						  data: JSON.stringify({ imdb_id: imdb_id }),
						  success: function (response) {
							  alert(response.message);
							  button.text("Added").prop("disabled", true);
						  },
						  error: function (error) {
							  console.log("ERROR ->" + error);
						  }
					  });
				  });
                    var watchedHistoryButton = $("<button/>")
    				.text("Add to Watched History")
    				.attr("data-imdb-id", imdbID)
    				.addClass("btn btn-primary btn-sm") // Optional styling for consistency
    				.click(function (event) {
        				event.preventDefault();
        				var imdb_id = $(this).data("imdb-id");
        				var button = $(this);
        				$.ajax({
            				type: "POST",
            				url: "/add_to_watched_history",
            				dataType: "json",
            				contentType: "application/json;charset=UTF-8",
            				data: JSON.stringify({ imdb_id: imdb_id }),
            				success: function (response) {
                				alert(response.message);
                				button.text("Added to History").prop("disabled", true);
            				},
            					error: function (error) {
                				console.error("Error adding to watched history:", error);
                				alert("An error occurred. Please try again.");
            				}
        				});
    				});
					var tableLayout = $("<table cellspacing='0' cellpadding='0' width='100%' />");
					var row = $("<tr />");
					var leftColumn = $("<td width='80%' />").append(li).append(link).append(radios).append(watchlistButton).append(watchedHistoryButton); // Radio buttons and Watchlist button in the left column
					var rightColumn = $("<td width='20%' />").append(image); // Image in the right column

					row.append(leftColumn).append(rightColumn);
					tableLayout.append(row);

					// diventry.append(li)
					// diventry.append(link)
					diventry.append(tableLayout)
					// diventry.append(image)
					// diventry.append(watchlistButton)
					fieldset.append(diventry)
					ulList.append(fieldset)
				}

				$("#recommendedMoviesSection").removeClass("d-none");
				$(".feedbackDiv").removeClass("d-none");
				$("#loader").attr("class", "d-none")

				
				$("html, body").animate({
					scrollTop: $("#recommendedMoviesSection").offset().top-60
				}, 800) // duration of 1 second (1000 ms)
			},
			error: function (error) {
				console.log("ERROR ->" + error)
				$("#loader").attr("class", "d-none")
			},
		})
	})


	window.addEventListener("popstate", function (event) {
		// Check if the user is navigating back
		if (event.state && event.state.page === "redirect") {
			// Redirect the user to a specific URL
			window.location.href = "/"
			location.reload()
		}
	})

	function login(user, password) {
		$("#logInError").hide()
		data = {
			username: user,
			password: password,
		}
		//Possibility of other cases.
		$.ajax({
			type: "POST",
			url: "/log",
			dataType: "json",
      		contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
          // Navigate to the search page
        $("#loaderLogin").attr("class", "d-flex justify-content-center")
        $("#centralDivLogin").hide()
        $("#loginTopNav").hide()
        setTimeout(function () {
          window.location.href = "/landing" // Replace with the actual URL of your search page
        }, 2000)
			},
			error: function (error) {
        $("#User").val("")
			  $("#Password").val("")
			  $("#logInError").attr("class", "d-flex justify-content-center")
      },
		})
	}

	// Bind the login function to the login button click
	$("#loginButton").click(function () {
		login($("#User").val(), $("#Password").val())
	})

	function createAccount() {
		$("#createAccountForm").attr("class", "d-flex justify-content-center")
		$("#centralDivLogin").hide()
		$("#loginTopNav").hide()
	}

	// Bind the login function to the login button click
	$("#createAccountButton").click(function () {
		createAccount()
	})


	function backToLogin(){
		
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/" // Replace with the actual URL of your search page
		}, 2000)
		

	}
	$("#backToLogin").click(function () {
		backToLogin()
	})

	
	function signOut() {
		data = {
			user: 'None'
		}
		$.ajax({
			type: "POST",
			url: "/out",
			dataType: "json",
      		contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
			// Navigate to the search page
			setTimeout(function () {
			window.location.href = "/" // Replace with the actual URL of your search page
			})
			},
			error: function (error) {
        	
      },
		})
	}

	function friend(username) {
		data = {
			username:username
		}
		$.ajax({
			type: "POST",
			url: "/friend",
			dataType: "json",
      		contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
				console.log(response)
				$("#friendsList").append(response.username);
				$("#addFriend").val("")
			},
			error: function (error) {
        
      		},
		})
	}

	$("#friendButton").click(function () {
		friend($("#addFriend").val())
	})

	$("#signOut").click(function () {
		signOut()
	})

	function guest() {
		data = {
			guest:'guest'
		}
		//Possibility of other cases.
		$.ajax({
			type: "POST",
			url: "/guest",
			dataType: "json",
      		contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
          	// Navigate to the search page
        	$("#centralDivLogin").hide()
       		$("#loginTopNav").hide()
        	setTimeout(function () {
          	window.location.href = "/landing" // Replace with the actual URL of your search page
        	}, 2000)
			},
			error: function (error) {
        
      },
		})
	}
	$("#guestPass").click(function () {
		guest()
	})

	function makeAccount(email, username, password, dupPassword) {
		if (password != dupPassword) {
			$("#newPassword").val("")
			$("#dupPassword").val("")
			$("#misMatchPass").attr("class", "d-flex justify-content-center")
		} else if (username == 'testUser'){
            $("#newUser").val("")
            $("#invalidUsername").attr("class", "d-flex justify-content-center")
        } else {
			data = {
				email: email,
				username: username,
				password: password,
			}
			//Possibility of other cases.
			$.ajax({
				type: "POST",
				url: "/",
				dataType: "json",
				contentType: "application/json;charset=UTF-8",
				traditional: "true",
				cache: false,
				data: JSON.stringify(data),
				success: function (response) {
					setTimeout(function () {
						window.location.href = "/" // Replace with the actual URL of your search page
					}, 2000)
				},
				error: function (error) {},
			})
		}
	}

	// Bind the login function to the login button click
	$("#makeAccountButton").click(function () {
		makeAccount(
			$("#emailAcc").val(),
			$("#newUser").val(),
			$("#newPassword").val(),
			$("#dupPassword").val()
		)
	})

	// Function to handle Get Started button click
	function getStarted() {
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/search_page" // Replace with the actual URL of your search page
		}, 2000)
	}

    	// Bind the getStarted function to the Get Started button click
	$("#getStartedNav").click(function () {
		getStarted();
		// getRecentMovies();
	});

	$("#getStartedButton").click(function () {
		getStarted();
		// getRecentMovies();
	});

    // Function to handle Get Started button click
	function goToWall() {
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/wall" // Replace with the actual URL of your search page
		}, 2000)
	}

    // Bind the getStarted function to the Get Started button click
	$("#goToWallNav").click(function () {
		goToWall();
	});
	$("#goToWallButton").click(function () {
		goToWall();
	});

	// Function to handle Review button click
	function goToReview() {
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/review" // Replace with the actual URL of your search page
		}, 2000)
	}

    // Bind the review function to the Review button click
	$("#goToReviewNav").click(function () {
		goToReview();
	});
	$("#goToReviewButton").click(function () {
		goToReview();
	});

	// Function to handle Profile button click
	function goToProfile() {
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/profile" // Replace with the actual URL of your search page
		}, 2000)
	}

    // Bind the getStarted function to the Get Started button click
	
	$("#goToProfileNav").click(function () {
		goToProfile();
	});

	function goToWatchlist(){
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/watchlist" // Replace with the actual URL of your search page
		}, 2000)

	}
	$("#goToWatchlist").click(function () {
		goToWatchlist();
	});

	function goToWatchedHistory(){
		// Navigate to the search page
		$("#loaderLanding").attr("class", "d-flex justify-content-center")
		$("#centralDivLanding").hide()
		$("#landingTopNav").hide()
		setTimeout(function () {
			window.location.href = "/watched_history" // Replace with the actual URL of your search page
		}, 2000)
	}
	$("#goToWatchedHistory").click(function () {
		goToWatchedHistory();
	});

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
	$("#backToLandingNav").click(function () {
		backToLandingPage();
	});
	$("#backToLanding").click(function () {
		backToLandingPage();
	});

	var FeedbackData

	$("#feedback").click(function () {
		notifyMeButton = document.getElementById("checkbox")
		notifyMeButton.disabled = false
		var myForm = $("fieldset")
		var data = {}
		var labels = {
			1: "Dislike",
			2: "Yet to watch",
			3: "Like",
		}

		// to check if any movies selected before giving feedback
		if (myForm.length == 0) {
			alert("No movies found. Please add movies to provide feedback.")
			return
		}
		var error = false // Flag to track errors

		for (var i = 0; i < myForm.length; i++) {
			var input = $("#" + i)
				.find("div")
				.find("input:checked")[0]
			var movieName = $("#" + i)
				.find("div")
				.find("li")[0].innerText

			if (!input) {
				// If no selection is made, set error flag to true and break the loop
				error = true
				break
			}

			data[movieName] = labels[input.value]
		}

		if (error) {
			// Display an error message if there are missing selections
			alert("Please select a feedback for all movies.")
			return // Exit the function without making the AJAX call
		}

		FeedbackData = data
		localStorage.setItem("fbData", JSON.stringify(data))
		$.ajax({
			type: "POST",
			url: "/feedback",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
				window.location.href = "/success"
			},
			error: function (error) {
				console.log("ERROR ->" + error)
			},
		})
	})

	$("#notifyButton").click(function () {
		var data = JSON.parse(localStorage.getItem("fbData"))
		$("#loaderSuccess").attr("class", "d-flex justify-content-center")
		if (!data) {
			alert("No feedback data found. Please provide feedback.")
			return
		}

		var emailString = $("#emailField").val()
		data.email = emailString

		// Remove the "emailSent" flag to allow sending the email again
		localStorage.removeItem("emailSent")

		$.ajax({
			type: "POST",
			url: "/sendMail",
			dataType: "json",
			contentType: "application/json;charset=UTF-8",
			traditional: "true",
			cache: false,
			data: JSON.stringify(data),
			success: function (response) {
				$("#loaderSuccess").attr("class", "d-none")
				$("#emailSentSuccess").show()
				setTimeout(function () {
					$("#emailSentSuccess").fadeOut("slow")
				}, 2000)
				$("#area1").attr("placeholder", "Email")
				$("#emailField").val("")
			},
			error: function (error) {
				$("#loaderSuccess").attr("class", "d-none")
				console.log("ERROR ->" + error)
				localStorage.removeItem("fbData")
			},
		})
	})
})
