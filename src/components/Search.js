import React, { useState } from 'react';
import axios from 'axios';

const Search = ({ onMovieSelect }) => {
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);

    const findMovies = async (event) => {
        const { value } = event.target;
        setQuery(value);

        if (value.length > 2) {
            const apiKey = process.env.REACT_APP_OMDB_API_KEY;
            const res = await axios.get(`https://www.omdbapi.com/?s=${value}&apikey=${apiKey}`);
            setMovies(res.data.Search || []);
        }
    };

    return (
        <div className="bg-gray-800 py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center">
                    <h3 className="text-2xl text-white mb-4">Search Movie:</h3>
                    <input
                        type="text"
                        className="p-4 text-gray-900 rounded-md w-full max-w-md"
                        placeholder="Search Movie Title ..."
                        value={query}
                        onChange={findMovies}
                    />
                    {movies.length > 0 && (
                        <div className="bg-gray-700 mt-2 rounded-md w-full max-w-md overflow-y-auto max-h-80">
                            {movies.map((movie) => (
                                <div
                                    key={movie.imdbID}
                                    className="flex items-center p-2 border-b border-gray-600 last:border-b-0 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                        setMovies([])
                                        onMovieSelect(movie.imdbID)
                                    }
                                    }
                                >
                                    <img
                                        src={movie.Poster}
                                        alt={movie.Title}
                                        className="w-12 h-16 object-cover mr-2"
                                    />
                                    <div className="text-white">
                                        <h4 className="text-lg">{movie.Title}</h4>
                                        <p className="text-sm opacity-75">{movie.Year}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
