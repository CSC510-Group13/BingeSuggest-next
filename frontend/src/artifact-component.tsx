import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MovieSearchDropdown from "@/components/MovieSearchDropdown";

const API_BASE_URL = "http://127.0.0.1:5000";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleLogin = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setUser(username);
      } else {
        setError("Login failed. Check your username and password.");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "An error occurred during login."
      );
    }
  };

  const handleCreateAccount = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        // Account created successfully, you might want to automatically log in
        setUser(username);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Account creation failed.");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "An error occurred during account creation."
      );
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/guest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest: "guest" }),
      });

      if (response.ok) {
        setUser("guest");
      } else {
        setError("Login failed. Check your username and password.");
      }
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "An error occurred during guest login."
      );
    }
    setUser("guest");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">
          {creatingAccount ? "Create Account" : "Login"}
        </h2>
      </CardHeader>
      <CardContent>
        {error && <p className="text-red-500">{error}</p>}
        {creatingAccount && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        {creatingAccount ? (
          <Button onClick={handleCreateAccount} className="w-full mb-2">
            Create Account
          </Button>
        ) : (
          <Button onClick={handleLogin} className="w-full mb-2">
            Login
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full mb-2"
          onClick={() => setCreatingAccount(!creatingAccount)}
        >
          {creatingAccount ? "Switch to Login" : "Create Account"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleGuestLogin}
        >
          Continue as Guest
        </Button>
      </CardFooter>
    </Card>
  );
};

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchContainerRef = useRef(null);

  const handleSearch = async (term) => {
    if (term.length < 3) {
      // Don't search for very short terms
      setSearchResults([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `q=${encodeURIComponent(term)}`,
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
        setIsDropdownOpen(true);
      } else {
        console.error("Search failed");
        setSearchResults([]);
        setIsDropdownOpen(false);
      }
    } catch (err) {
      console.error("An error occurred during search:", err);
      setSearchResults([]);
      setIsDropdownOpen(false);
    }
  };

  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    handleSearch(term);
  };

  const handleSelectMovie = async (movieTitle) => {
    console.log("Selected movie:", movieTitle); // Debugging

    try {
      // Fetch IMDb ID using new `/get_imdb_id` route
      const response = await fetch(`${API_BASE_URL}/get_imdb_id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_name: movieTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        const imdbId = data.imdb_id;

        if (imdbId) {
          console.log(
            "Redirecting to IMDb:",
            `https://www.imdb.com/title/${imdbId}/`
          );

          // Open IMDb page in a new tab
          window.open(`https://www.imdb.com/title/${imdbId}/`, "_blank");
        } else {
          console.error("IMDb ID not found for:", movieTitle);
        }
      } else {
        console.error("Failed to fetch IMDb ID for:", movieTitle);
      }
    } catch (error) {
      console.error("Error fetching IMDb ID:", error);
    }

    setSearchTerm("");
    setSearchResults([]);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={searchContainerRef}>
      <Input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search for movies..."
        className="w-full"
        autoComplete="off"
      />
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <ul>
            {searchResults.map((movie, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectMovie(movie)}
              >
                {movie}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const RecommendationsPage = ({ user }) => {
  const [recommendationType, setRecommendationType] = useState("all");
  const [userMovies, setUserMovies] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const fetchRecommendations = async () => {
    if (!userMovies.trim()) {
      setRecommendations([]);
      return;
    }

    const movies = userMovies.split(",").map((movie) => movie.trim());
    try {
      const response = await fetch(`${API_BASE_URL}/${recommendationType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_list: movies }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(
          data.recommendations.map((rec, index) => ({
            title: rec,
            genre: data.genres[index],
            imdb_id: data.imdb_id[index],
          }))
        );
      } else {
        console.error("Failed to fetch recommendations");
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching recommendations."
      );
      setRecommendations([]);
    }
  };

  // Function to fetch movie details by IMDb ID
  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch movie details for IMDb ID:", imdbId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching movie details for IMDb ID:", imdbId, error);
      return null;
    }
  };

  const handleSelectMovie = async (movieTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_imdb_id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_name: movieTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        const imdbId = data.imdb_id;

        if (imdbId) {
          window.open(`https://www.imdb.com/title/${imdbId}/`, "_blank");
        } else {
          console.error("IMDb ID not found for:", movieTitle);
        }
      } else {
        console.error("Failed to fetch IMDb ID for:", movieTitle);
      }
    } catch (error) {
      console.error("Error fetching IMDb ID:", error);
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Enter movies (comma-separated):
        </label>
        <Input
          type="text"
          value={userMovies}
          onChange={(e) => setUserMovies(e.target.value)}
          className="mt-1"
          placeholder="e.g., Movie A, Movie B, Movie C"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Recommendation Type:
        </label>
        <select
          value={recommendationType}
          onChange={(e) => setRecommendationType(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="all">All</option>
          <option value="genreBased">Genre Based</option>
          <option value="dirBased">Director Based</option>
          <option value="actorBased">Actor Based</option>
        </select>
      </div>
      <Button onClick={fetchRecommendations}>Get Recommendations</Button>
      <ul className="mt-4">
        {recommendations.map((movie, index) => (
          <li key={index} className="mb-2 flex items-center">
            {" "}
            {/* Added flex container */}
            <span
              className="text-blue-500 hover:underline cursor-pointer"
              onClick={() => handleSelectMovie(movie.title)}
            >
              {movie.title}
            </span>
            <span className="ml-2 text-gray-600">({movie.genre})</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const WatchlistPage = ({ user }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [movieToAdd, setMovieToAdd] = useState("");
  const [movieAdded, setMovieAdded] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [addTrigger, setAddTrigger] = useState(false);

  // Function to fetch movie details by IMDb ID
  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch movie details for IMDb ID:", imdbId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching movie details for IMDb ID:", imdbId, error);
      return null;
    }
  };

  const fetchWatchlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getWatchlistData`);
      if (response.ok) {
        const data = await response.json();
        // Fetch movie details for each movie in the watchlist
        const detailedWatchlist = await Promise.all(
          data.map(async (item) => {
            const movieDetails = await fetchMovieDetails(item.imdb_id);
            return { ...item, ...movieDetails }; // Combine watchlist item with movie details
          })
        );
        setWatchlist(detailedWatchlist);
      } else {
        console.error("Failed to fetch watchlist");
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching watchlist."
      );
    }
  };

  useEffect(() => {
    if (user && user !== "guest") {
      fetchWatchlist();
    }
  }, [user, deleteTrigger, addTrigger]);

  const handleAddToWatchlist = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/add_to_watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieName: movieToAdd }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
        setMovieAdded(true);
        setAddTrigger(!addTrigger);
        setTimeout(() => setMovieAdded(false), 5000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error adding to watchlist."
      );
    }
    setMovieToAdd("");
  };

  const handleDeleteFromWatchlist = async (imdb_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/deleteWatchlistData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imdb_id), // Corrected line
      });

      if (response.ok) {
        console.log("Successfully removed");
        setDeleteTrigger(!deleteTrigger);
      } else {
        console.error("Failed to delete from watchlist");
      }
    } catch (error) {
      console.error("Error deleting from watchlist:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error deleting from watchlist."
      );
    }
  };
  if (!user || user === "guest") {
    return <div>Please log in to use the watchlist.</div>;
  }

  return (
    <div>
      {movieAdded && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Movie added to watchlist.</span>
        </div>
      )}
      <div className="flex items-center space-x-2 mb-4">
        <MovieSearchDropdown
          placeholder="Enter movie name to add..."
          onSelect={(movie) => setMovieToAdd(movie)}
          className="flex-grow"
        />
        <Button onClick={handleAddToWatchlist}>Add to Watchlist</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Poster</TableHead>
            <TableHead className="w-[150px]">Movie Name</TableHead>
            <TableHead>Time Added</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchlist.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {/* Display movie poster */}
                <img
                  src={item.Poster}
                  alt={item.name}
                  className="h-12 w-12 object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">
                <a
                  href={`/movie/${item.imdb_id}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.name}
                </a>
              </TableCell>
              <TableCell>{item.time}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Remove</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this movie from your watched list.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteFromWatchlist(item.imdb_id)}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const WatchedHistoryPage = ({ user }) => {
  const [watchedHistory, setWatchedHistory] = useState([]);
  const [movieToAdd, setMovieToAdd] = useState("");
  const [watchedDate, setWatchedDate] = useState(""); // New state for watched date
  const [movieAdded, setMovieAdded] = useState(false);
  const [deleteTrigger, setDeleteTrigger] = useState(false);
  const [addTrigger, setAddTrigger] = useState(false);

  // Function to fetch movie details by IMDb ID
  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch movie details for IMDb ID:", imdbId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching movie details for IMDb ID:", imdbId, error);
      return null;
    }
  };

  const fetchWatchedHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getWatchedHistoryData`);
      if (response.ok) {
        const data = await response.json();
        // Fetch movie details for each movie in watched history
        const detailedWatchedHistory = await Promise.all(
          data.map(async (item) => {
            const movieDetails = await fetchMovieDetails(item.imdb_id);
            return { ...item, ...movieDetails }; // Combine history item with movie details
          })
        );
        setWatchedHistory(detailedWatchedHistory);
      } else {
        console.error("Failed to fetch watched history");
      }
    } catch (error) {
      console.error("Error fetching watched history:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching watched history."
      );
    }
  };

  const handleDeleteFromWatchedHistory = async (imdb_id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/removeFromWatchedHistory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imdb_id: imdb_id }), // Send as an object
      });

      if (response.ok) {
        console.log("Successfully removed from watched history");
        setDeleteTrigger(!deleteTrigger);
      } else {
        console.error("Failed to delete from watched history");
      }
    } catch (error) {
      console.error("Error deleting from watched history:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error deleting from watched history."
      );
    }
  };
  useEffect(() => {
    if (user && user != "guest") {
      fetchWatchedHistory();
    }
  }, [user, deleteTrigger, addTrigger]);

  const handleAddToWatchedHistory = async () => {
    if (!user || user === "guest") {
      alert("Please log in to use the watched history.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/add_to_watched_history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: movieToAdd,
          watched_date: watchedDate,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        console.log(result.message);
        setMovieAdded(true);
        setAddTrigger(!addTrigger);
        setTimeout(() => setMovieAdded(false), 5000);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error adding to watched history:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error adding to watched history."
      );
    }
  };

  if (!user || user === "guest") {
    return <div>Please log in to use the watched history.</div>;
  }

  return (
    <div>
      {movieAdded && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Movie added to Watched History.
          </span>
        </div>
      )}
      <div className="flex items-center space-x-2 mb-4">
        <MovieSearchDropdown
          placeholder="Enter movie name..."
          onSelect={(movie) => setMovieToAdd(movie)}
          className="flex-grow"
        />
        <Input
          type="date"
          value={watchedDate}
          onChange={(e) => setWatchedDate(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleAddToWatchedHistory}>
          Add to Watched History
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Poster</TableHead>
            <TableHead className="w-[150px]">Movie Name</TableHead>
            <TableHead>Watched Date</TableHead>
            <TableHead className="text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {watchedHistory.map((item, index) => (
            <TableRow key={index}>
              {/* Display movie poster */}
              <TableCell>
                <img
                  src={item.Poster}
                  alt={item.movie_name}
                  className="h-12 w-12 object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">
                <a
                  href={`/movie/${item.imdb_id}`}
                  className="text-blue-500 hover:underline"
                >
                  {item.movie_name}
                </a>
              </TableCell>
              <TableCell>{item.watched_date}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline">Remove</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this movie from your watched history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() =>
                          handleDeleteFromWatchedHistory(item.imdb_id)
                        }
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const WallPage = ({ user }) => {
  const [wallPosts, setWallPosts] = useState([]);
  const [reviewMovie, setReviewMovie] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewScore, setReviewScore] = useState(5);
  const [reviewPosted, setReviewPosted] = useState(false);
  const [addTrigger, setAddTrigger] = useState(false);

  // Function to fetch movie details by IMDb ID
  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch movie details for IMDb ID:", imdbId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching movie details for IMDb ID:", imdbId, error);
      return null;
    }
  };

  const fetchWallPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getWallData`);
      if (response.ok) {
        const data = await response.json();
        // Fetch movie details for each wall post
        const detailedWallPosts = await Promise.all(
          data.map(async (post) => {
            const movieDetails = await fetchMovieDetails(post.imdb_id);
            return { ...post, ...movieDetails }; // Combine post with movie details
          })
        );
        setWallPosts(detailedWallPosts);
      } else {
        console.error("Failed to fetch wall posts");
      }
    } catch (error) {
      console.error("Error fetching wall posts:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching wall posts."
      );
    }
  };

  useEffect(() => {
    fetchWallPosts();
  }, [addTrigger]);

  const submitReview = async () => {
    if (!user || user === "guest") {
      alert("Please log in to submit a review.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movie: reviewMovie,
          review: reviewText,
          score: reviewScore,
        }),
      });

      if (response.ok) {
        console.log("Review submitted successfully");
        setReviewMovie("");
        setReviewText("");
        setReviewScore(5);
        setReviewPosted(true);
        setAddTrigger(!addTrigger);
        setTimeout(() => setReviewPosted(false), 5000);
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error submitting review."
      );
    }
  };

  if (!user) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
        <ScrollArea className="h-72 w-full rounded-md border">
          <div className="p-4">
            {wallPosts.map((post, index) => (
              <Card key={index} className="mb-4 flex">
                {" "}
                {/* Added flex container */}
                <CardHeader className="w-1/4 pr-4">
                  {" "}
                  {/* Adjust width and spacing */}
                  {/* Display movie poster */}
                  <img
                    src={post.Poster}
                    alt={post.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <h3 className="text-lg font-semibold mt-2">
                    <a
                      href={`/movie/${post.imdb_id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {post.name}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reviewed by {post.username} - {post.time}
                  </p>
                </CardHeader>
                <CardContent className="w-3/4">
                  {" "}
                  {/* Adjust width */}
                  <p className="text-gray-700">"{post.review}"</p>
                </CardContent>
                <CardFooter className="w-1/4">
                  {" "}
                  {/* Adjust width */}
                  <p className="text-gray-700">Rating: {post.score}/10</p>
                </CardFooter>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div>
      {reviewPosted && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your review has been posted</span>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Submit a Review</h2>
        <div className="flex items-center space-x-2 mb-2">
          <MovieSearchDropdown
            placeholder="Enter movie name"
            onSelect={(movie) => setReviewMovie(movie)}
            className="flex-grow"
          />
          <Input
            type="number"
            value={reviewScore}
            min="1"
            max="10"
            onChange={(e) => setReviewScore(parseInt(e.target.value, 10))}
            className="w-20"
          />
        </div>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full h-24 p-2 border rounded-md resize-none"
        ></textarea>
        <Button onClick={submitReview} className="mt-2">
          Submit Review
        </Button>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
      <ScrollArea className="h-72 w-full rounded-md border">
        <div className="p-4">
          {wallPosts.map((post, index) => (
            <Card key={index} className="mb-4 flex">
              {" "}
              {/* Added flex container */}
              <CardHeader className="w-1/4 pr-4">
                {" "}
                {/* Adjust width and spacing */}
                {/* Display movie poster */}
                <img
                  src={post.Poster}
                  alt={post.name}
                  className="h-20 w-20 object-cover rounded"
                />
                <h3 className="text-lg font-semibold mt-2">
                  <a
                    href={`/movie/${post.imdb_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {post.name}
                  </a>
                </h3>
                <p className="text-sm text-gray-500">
                  Reviewed by {post.username} - {post.time}
                </p>
              </CardHeader>
              <CardContent className="w-3/4">
                {" "}
                {/* Adjust width */}
                <p className="text-gray-700">"{post.review}"</p>
              </CardContent>
              <CardFooter className="w-1/4">
                {" "}
                {/* Adjust width */}
                <p className="text-gray-700">Rating: {post.score}/10</p>
              </CardFooter>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
};

const FriendsPage = ({ user }) => {
  const [friends, setFriends] = useState([]);
  const [friendUsername, setFriendUsername] = useState("");
  const [selectedFriend, setSelectedFriend] = useState("");
  const [friendActivity, setFriendActivity] = useState([]);
  const [friendAdded, setFriendAdded] = useState(false);
  const [addTrigger, setAddTrigger] = useState(false);

  // Function to fetch movie details by IMDb ID
  const fetchMovieDetails = async (imdbId) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${imdbId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        return await response.json();
      } else {
        console.error("Failed to fetch movie details for IMDb ID:", imdbId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching movie details for IMDb ID:", imdbId, error);
      return null;
    }
  };

  useEffect(() => {
    if (user && user !== "guest") {
      fetchFriends();
    }
  }, [user, addTrigger]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/getFriends`);
      if (response.ok) {
        const data = await response.json();
        const usernames = data.map((item) => item[0]); // Extract usernames
        setFriends(usernames);
      } else {
        console.error("Failed to fetch friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching friends."
      );
    }
  };

  const handleAddFriend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/friend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: friendUsername }),
      });

      if (response.ok) {
        setFriendUsername("");
        setFriendAdded(true);
        setAddTrigger(!addTrigger);
        setTimeout(() => setFriendAdded(false), 5000);
      } else {
        console.error("Failed to add friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error adding friend."
      );
    }
  };

  const fetchFriendActivity = async (friend) => {
    try {
      const response = await fetch(`${API_BASE_URL}/getRecentFriendMovies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(friend),
      });

      if (response.ok) {
        const data = await response.json();
        // Fetch movie details for each activity
        const detailedActivity = await Promise.all(
          data.map(async (activity) => {
            const movieDetails = await fetchMovieDetails(activity.imdb_id);
            return { ...activity, ...movieDetails }; // Combine activity with movie details
          })
        );
        setFriendActivity(detailedActivity);
      } else {
        console.error("Failed to fetch friend activity");
      }
    } catch (error) {
      console.error("Error fetching friend activity:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching friend activity"
      );
    }
  };

  const handleFriendSelection = (friend) => {
    setSelectedFriend(friend);
    fetchFriendActivity(friend);
  };

  const handleSelectMovie = async (movieTitle) => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_imdb_id`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movie_name: movieTitle }),
      });

      if (response.ok) {
        const data = await response.json();
        const imdbId = data.imdb_id;

        if (imdbId) {
          window.open(`https://www.imdb.com/title/${imdbId}/`, "_blank");
        } else {
          console.error("IMDb ID not found for:", movieTitle);
        }
      } else {
        console.error("Failed to fetch IMDb ID for:", movieTitle);
      }
    } catch (error) {
      console.error("Error fetching IMDb ID:", error);
    }
  };

  if (!user || user === "guest") {
    return <div>Please log in to use the friends feature.</div>;
  }

  return (
    <div>
      {friendAdded && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Friend added successfully.</span>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Add Friend</h2>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Enter friend's username"
            className="flex-grow"
          />
          <Button onClick={handleAddFriend}>Add Friend</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Friends List</h2>
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
              {friends.map((friend, index) => (
                <div key={index} className="mb-2">
                  <Button
                    variant={selectedFriend === friend ? "default" : "ghost"}
                    onClick={() => handleFriendSelection(friend)}
                    className="w-full text-left"
                  >
                    {friend}
                  </Button>
                </div>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Friend Activity</h2>
          <ScrollArea className="h-72 w-full rounded-md border">
            <div className="p-4">
              {friendActivity.map((activity, index) => (
                <Card key={index} className="mb-4 flex">
                  <CardHeader className="w-1/4 pr-4">
                    <img
                      src={activity.Poster}
                      alt={activity.name}
                      className="h-20 w-20 object-cover rounded"
                    />
                    <h3 className="text-lg font-semibold mt-2">
                      <span
                        className="text-blue-500 hover:underline cursor-pointer"
                        onClick={() => handleSelectMovie(activity.name)}
                      >
                        {activity.name}
                      </span>
                    </h3>
                  </CardHeader>
                  <CardContent className="w-3/4">
                    <p>Rating: {activity.score}/10</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

const MoviePage = ({ user }) => {
  const [movieData, setMovieData] = useState(null);
  const [discussion, setDiscussion] = useState([]);
  const [comment, setComment] = useState("");
  const [addTrigger, setAddTrigger] = useState(false);
  const [commentPosted, setCommentPosted] = useState(false);

  // Extract the movie ID from the URL
  const movieId = window.location.pathname.split("/").pop();

  const fetchMovieData = async () => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?i=${movieId}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (response.ok) {
        const data = await response.json();
        setMovieData(data);
      } else {
        console.error("Failed to fetch movie data");
      }
    } catch (error) {
      console.error("Error fetching movie data:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching movie data."
      );
    }
  };

  const fetchDiscussion = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movieDiscussion/${movieId}`
      );
      if (response.ok) {
        const data = await response.json();
        setDiscussion(data);
      } else {
        console.error("Failed to fetch discussion");
      }
    } catch (error) {
      console.error("Error fetching discussion:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching discussion."
      );
    }
  };

  const handlePostComment = async () => {
    if (!user || user === "guest") {
      alert("Please log in to post a comment.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/movieDiscussion/${movieId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: user, comment: comment }),
        }
      );

      if (response.ok) {
        console.log("Comment posted successfully");
        setComment("");
        setCommentPosted(true);
        setAddTrigger(!addTrigger);
        setTimeout(() => setCommentPosted(false), 5000);
      } else {
        console.error("Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert(
        error.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error posting comment."
      );
    }
  };

  useEffect(() => {
    fetchMovieData();
    fetchDiscussion();
  }, [movieId, addTrigger]);

  if (!movieData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">{movieData.Title}</h1>
          <p className="text-gray-500">
            {movieData.Year} | {movieData.Genre} | {movieData.Runtime}
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap">
            <div className="md:w-1/3 pr-4 mb-4 md:mb-0">
              <img
                src={movieData.Poster}
                alt={movieData.Title}
                className="w-full rounded-md"
              />
            </div>
            <div className="md:w-2/3">
              <p className="mb-4">{movieData.Plot}</p>
              <p>
                <strong>Director:</strong> {movieData.Director}
              </p>
              <p>
                <strong>Actors:</strong> {movieData.Actors}
              </p>
              <p>
                <strong>IMDb Rating:</strong> {movieData.imdbRating}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Discussion</h2>
            {commentPosted && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">
                  {" "}
                  Your comment has been posted.
                </span>
              </div>
            )}
            {(!user || user === "guest") && (
              <p className="text-red-500 mb-2">Sign in to Comment</p>
            )}
            <div className="flex items-center space-x-2 mb-4">
              <Input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your comment here..."
                className="flex-grow"
                disabled={!user || user === "guest"}
              />
              <Button
                onClick={handlePostComment}
                disabled={!user || user === "guest"}
              >
                Post Comment
              </Button>
            </div>
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                {discussion.map((item, index) => (
                  <div key={index} className="mb-2 p-2 border rounded">
                    <p className="font-bold">{item.user}</p>
                    <p>{item.comment}</p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const RecommendationGenieTab: React.FC = () => {
  const [query, setQuery] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ai_recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations);
      }
    } catch (err) {
      console.error("Error fetching AI recommendations:", err);
      alert(
        err.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "Error fetching AI recommendations."
      );
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">🔮 Recommendation Genie</h2>
      <p className="text-sm text-gray-600">
        Ask the Genie for movie recommendations based on mood, genre, or theme!
      </p>

      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="E.g., 'A sci-fi adventure with a deep storyline'"
        className="mt-2"
      />
      <Button onClick={fetchAIRecommendations} className="mt-2">
        {loading ? "Summoning Genie..." : "Ask the Genie"}
      </Button>

      {recommendations.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-bold">✨ Magic Picks for You:</h3>
          <ul className="mt-2">
            {recommendations.map((movie, index) => (
              <li key={index} className="text-sm text-gray-700">
                {movie}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  // Add dark mode state
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Toggle dark class on html element based on darkMode
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    //  could check for a session cookie here to auto-login
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/out`, { method: "POST" });
      if (response.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("An error occurred during logout:", err);
      alert(
        err.message.includes("Failed to fetch")
          ? "Backend API cannot be reached."
          : "An error occurred during logout."
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">BingeSuggest</h1>
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
              <div className="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700">Dark Mode</span>
          </label>
          {/* ...existing logout code... */}
          {user && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline">Logout</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Logging out will end your current session.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLogout}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <Tabs defaultValue={user ? "search" : "login"} className="w-full">
        <TabsList className="grid w-full grid-cols-8 mb-4">
          {!user && <TabsTrigger value="login">Login</TabsTrigger>}
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="recommendationGenie">
            🔮 Recommendation Genie
          </TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="watched_history">Watched History</TabsTrigger>
          <TabsTrigger value="wall">Wall</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        {!user && (
          <TabsContent value="login">
            <LoginPage setUser={setUser} />
          </TabsContent>
        )}
        <TabsContent value="recommendationGenie">
          <RecommendationGenieTab />
        </TabsContent>
        <TabsContent value="search">
          <SearchPage />
        </TabsContent>
        <TabsContent value="recommendations">
          <RecommendationsPage user={user} />
        </TabsContent>
        <TabsContent value="watchlist">
          <WatchlistPage user={user} />
        </TabsContent>
        <TabsContent value="watched_history">
          <WatchedHistoryPage user={user} />
        </TabsContent>
        <TabsContent value="wall">
          <WallPage user={user} />
        </TabsContent>
        <TabsContent value="friends">
          <FriendsPage user={user} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
