import { useEffect } from "react";
import { useState } from "react";
import StarRating from "./StarRating";
import "./App.css";


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

  const KEY = 'fe421rety';

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const tempQuery = "PeakyBlinders";
  


  function handleSelectMovie(id) {
    setSelectedId((selectedMovie) => selectedMovie.id === id);
  }

  function handleCloseMovie(id) {
     console.log("close");
     setSelectedId(null);
  }

  function handleAddWatched(watchedMovie) {
      setWatched([...watched, watchedMovie])
  }

   useEffect(() => {
    const fetchMovies = async () => {
    try{ 
      setIsLoading(true);
      setError('');
    const res = await  fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`);
  
    if (!res.ok) throw new Error("Something went wrong with fetching movies");
    
    const data = await res.json();
    if (data.Response === "false") {
      throw new Error("Movie not found");
    }

     setMovies(data.Search); 
    } catch(err){
      console.error(err.message);
      setError(err.message);
    }finally{
      setIsLoading(false);
    }
  }

   if(!query.length){
    setMovies([]);
    setError("");
    return;
   }

    fetchMovies();
   }, [query]);

  return( 
  <>
  <Navbar>
    <Logo  />
    <Search query={query}  setQuery={setQuery} />
    <NumResults movies={movies} />
  </Navbar>

  <Main>
    {/*  Passing a component as a prop   */}
  {/* <Box element={ <MovieList movies={movies}   />} />  


  <Box element={
    <>
     <WatchedSummary watched={watched} />     
     <WatchedMovieList  watched={watched} />            
    </>
  } /> */}

   <Box>
   {isLoading && <Loader  /> }
   { !isLoading && !error && <MovieList movies={movies} onSelectMovie={handleSelectMovie} />}
   {error && <ErrorMessage message={error}  />}
   </Box>

   <Box>
    {selectedId ? (
       <MovieDetails 
         selectedId={selectedId} 
         onCloseMovie={handleCloseMovie}
         onWatchedMovie={handleAddWatched}
         />
      ): ( 
        <> 
      <WatchedSummary watched={watched} />     
      <WatchedMovieList  watched={watched} />          
      </>
    )}
   
   </Box>

  </Main>
  </> 

  )
};



function Navbar({children}) {
  return(
    <nav className="nav-bar">
         {children}
    </nav>
  )
};

function Logo()  {
  return (
    <div className="logo">
    <span role="img">🍿</span>
    <h1>usePopcorn</h1>
  </div>
 
 
)
}


function Search({ query, setQuery }) {
  return (
    <input
    className="search"
    type="text"
    placeholder="Search movies..."
    value={query}
    onChange={(e) => setQuery(e.target.value)}
    />
    
    
  )
}


function NumResults({movies}) {
  return(
    <p className="num-results">
    Found <strong>{movies.length}</strong> results
  </p>

)
}


function Main({ children }) {
  return (
    <>
      <main className="main">
         {children}
      </main>
    </>
  );
}

function Box({ children }) {
    const [isOpen, setIsOpen] = useState(true);
    
    return(
      <div className="box">
            <button
              className="btn-toggle"
              onClick={() => setIsOpen((open) => !open)}
              >
              {isOpen ? "–" : "+"}
            </button> 
            {isOpen &&  children }
          </div>   
    )
  }


// function ListBox({ children }){
  
//   return(
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen1((open) => !open)}
//             >
//             {isOpen1 ? "–" : "+"}
//           </button> 
//           {isOpen1 &&  children}
//         </div>   
//   )
// }

function MovieList({ movies, onSelectMovie })  { 
  return (
    <ul className="list list-movies">
    {movies?.map((movie) => (
      <Movie movie={movie} key={movie.imdbID} 
      onSelectMovie={onSelectMovie} />
    ))}
  </ul>
  );
}

function Movie({ movie, onSelectMovie }){
  return(
    <li onClick={() => onSelectMovie(movie.imdbID)}>
        <img src={movie.Poster} alt={`${movie.Title} 
        poster`} />
        <h3>{movie.Title}</h3>
        <div>
          <p>
            <span>🗓</span>
            <span>{movie.Year}</span>
          </p>
        </div>
      </li>
  )
}

function MovieDetails({ selectedId, onCloseMovie, onWatchedMovie }) {
   const [isLoading, setIsLoading] = useState(false);
   const [movie, setMovie] = useState({});

   const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
   }  = movie;

   function handleAdd() {
     const newWatchedMovie = {
        imdbID: selectedId,
        title,
        year,
        poster,
        imdbRating: Number(imdbRating),
        runtime: Number(runtime.split(" ").at(0)),
     };

      onAddWatched(newWatchedMovie);
   }

  useEffect(() => {
    async function getMovieDetails() {
       setLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setLoading(false);
    }
    getMovieDetails();
  }, [selectedId]);
 
  return (
    <div className="details">
      <header>
      <button className="btn-back" onClick={onCloseMovie}>
          &larr;
      </button>
      <img src={poster} alt={`poster of ${movie} movie`} />
       <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}  
          </p> 
          <p>{genre}</p>
          <p>
            <span>✨</span>
            {imdbRating} IMDB Rating
          </p>
       </div>
      </header>

      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} />
        </div>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
      {selectedId}
    </div>
  );
}


// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
  
  
//   return(
//     <div className="box">
//           <button
//             className="btn-toggle"
//             onClick={() => setIsOpen2((open) => !open)}
//             >
//             {isOpen2 ? "–" : "+"}
//           </button>
//           {isOpen2 && (
//           )}
//         </div>
//   )
// }


function WatchedSummary({ watched }){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  
  
  return(
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
  )
}

function WatchedMovieList({ watched }) {
  
  return (
    <ul className="list">
                {watched.map((movie) => (
                  <WatchedMovie movie={movie} key={movie.imdbID} />
                ))}
              </ul>
            )
          }


function WatchedMovie({ movie }) {
  return (
    <li>
    <img src={movie.Poster} alt={`${movie.title} poster`} />
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
    </div>
  </li>
  )
}




function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return(
  <p>
    Error
  </p>
  )
}

