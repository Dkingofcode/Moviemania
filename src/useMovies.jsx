import { useState, useEffect } from "react";

const KEY = 'f84fc31d';

const useMovies = (query) => {

    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");    
    
    
    
    
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
}, [query]

);

return { movies, isLoading, error };
}

export default useMovies;