import React from 'react';

const MovieDetails = ({ movie }) => {
    if (!movie) return null;

    return (
        <div className="container mx-auto px-4 py-6 text-white">
            <div className="flex flex-col items-center lg:flex-row lg:items-start lg:space-x-6">
                <div className="w-full lg:w-1/3 mb-6 lg:mb-0">
                    <img
                        src={movie.Poster}
                        alt={movie.Title}
                        className="rounded-lg w-full"
                    />
                </div>
                <div className="w-full lg:w-2/3 text-center lg:text-left">
                    <h2 className="text-4xl font-bold text-yellow-500 mb-4">{movie.Title}</h2>
                    <ul className="flex justify-center lg:justify-start space-x-4 mb-4">
                        <li className="bg-yellow-500 text-black px-2 py-1 rounded">{movie.Rated}</li>
                        <li>{movie.Year}</li>
                        <li>{movie.Released}</li>
                    </ul>
                    <p className="mb-4"><strong>Genre:</strong> {movie.Genre}</p>
                    <p className="mb-4"><strong>Writer:</strong> {movie.Writer}</p>
                    <p className="mb-4"><strong>Actors:</strong> {movie.Actors}</p>
                    <p className="mb-4"><strong>Plot:</strong> {movie.Plot}</p>
                    <p className="mb-4"><strong>Language:</strong> {movie.Language}</p>
                    <p className="flex items-center mb-4"><i className="fas fa-award text-yellow-500 mr-2"></i>{movie.Awards}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
