import { useEffect, useState } from "react";
import StartRating from "./StartRating";
import { unmountComponentAtNode } from "react-dom";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "bfc6600d";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const tempQuery = "don";
  // console.log(watched);

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleBack() {
    setSelectedId(null);
  }

  function watchedList(movie) {
    // console.log(mo)
    setWatched((watched) => [...watched, movie]);
    // setWatched(movie.filter((movie) => [...watched, movie]));
  }

  // console.log(watched);

  function handleDelateWatch(id) {
    // console.log(id);
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        setError("");
        setIsLoading(true);
        const res = await fetch(
          ` http://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
        );
        if (!res.ok) throw new Error("something is worng");
        const data = await res.json();
        // console.log(data);
        if (data.Response === "False") throw new Error("this movie not found");
        setMovies(data.Search);
        // console.log(data.Search)
      } catch (err) {
        // console.log(err.message);
        setError(err.message);
      } finally {
        setInterval(() => setIsLoading(false), 2000);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }

    handleBack();
    fetchMovies();
  }, [query]);

  // console.log(error);

  return (
    <div>
      <Navbar>
        <Logo />
        <Searchbox query={query} setQuery={setQuery} />
        <Number movie={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? (
            <p className="loader">Loading...</p>
          ) : (
            <MovieList movies={movies} setMovies={setMovies} />
          )} */}
          {isLoading && <p className="loader">Loading...</p>}
          {!isLoading && !error && (
            <MovieList
              handleSelectMovie={handleSelectMovie}
              movies={movies}
              watched={watched}
              setMovies={setMovies}
            />
          )}
          {error && <p className="error">{error}</p>}
        </Box>
        <Box>
          {selectedId ? (
            <SelectedMovie
              watchedList={watchedList}
              handleBack={handleBack}
              selectedId={selectedId}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatcheMoviList
                handleDelateWatch={handleDelateWatch}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </div>
  );
}

function SelectedMovie({ watchedList, selectedId, handleBack, watched }) {
  const [movies, setMovies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const isWatching = watched
    .map((watched) => watched.imdbID)
    .includes(selectedId);
  // console.log(isWatching);

  const yourRating = watched.map((movie) => movie.userRating);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Released: released,
    Plot: plot,
    Actors: actor,
    Director: director,
    Genre: genre,
  } = movies;

  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        ` http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );

      const data = await res.json();
      setMovies(data);
      setIsLoading(false);
      // console.log(data);
    }

    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePropcorn";
    };
  }, [title]);

  useEffect(() => {
    function callBack(e) {
      if (e.code === "Escape") {
        handleBack(null);
      }
    }

    document.addEventListener("keydown", callBack);

    return function () {
      document.removeEventListener("keydown", callBack);
    };
  }, [handleBack]);

  const handleAdd = () => {
    const newAddMovies = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating,
      runtime: runtime.split(" ").at(0),
      userRating,
    };

    watchedList(newAddMovies);
    handleBack();
  };

  // console.log(watched);

  return (
    <div className="details">
      {isLoading ? (
        <p className="loader">Loading...</p>
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={handleBack}>
              &larr;
            </button>
            <img src={poster} alt="movie" />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMBD rating
              </p>
            </div>
          </header>

          <section>
            {isWatching ? (
              <p>Already give you rating {yourRating}</p>
            ) : (
              <div className="rating">
                <StartRating
                  onRating={setUserRating}
                  maxRating={10}
                  size={24}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add
                  </button>
                )}
              </div>
            )}
            <p>
              <em>{plot}</em>
            </p>
            <p>starting {actor}</p>
            <p>director by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

function Navbar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Searchbox({ query, setQuery }) {
  // const [query, setQuery] = useState("");
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Number({ movie }) {
  return (
    <p className="num-results">
      Found <strong>{movie?.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function MovieList({ movies, handleSelectMovie, watched }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          handleSelectMovie={handleSelectMovie}
          watched={watched}
          movie={movie}
          key={movie.imdbID}
        />
      ))}
    </ul>
  );
}

function Movie({ movie, handleSelectMovie, watched }) {
  // const isWatchingMovie = (watched) => watched.imdbID;

  // console.log(isWatchingMovie);

  return (
    <li onClick={() => handleSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatcheMoviList({ watched, handleDelateWatch }) {
  // console.log(watched);
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchMovie
          movie={movie}
          key={movie.imdbID}
          handleDelateWatch={handleDelateWatch}
        />
      ))}
    </ul>
  );
}

function WatchMovie({ movie, handleDelateWatch }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button onClick={() => handleDelateWatch(movie.imdbID)}>*</button>
      </div>
    </li>
  );
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
