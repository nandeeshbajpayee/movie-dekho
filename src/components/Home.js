import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Search from './Search';
import MovieDetails from './MovieDetails';
import axios from 'axios';
import { auth } from '../firebaseConfig';
import PlaylistSection from './PlaylistSection';

const Home = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const navigate = useNavigate();




    const handleMovieSelect = async (imdbID) => {
        try {
            const apiKey = process.env.REACT_APP_OMDB_API_KEY;
            const res = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
            setSelectedMovie(res.data);
        } catch (error) {
            console.error("Error fetching movie details: ", error);
        }
    };


    const handleSignOut = async () => {
        await auth.signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 font-inter">
            <div className="py-6 border-b border-gray-700">
                <div className="container mx-auto px-4 flex flex-row">
                    <p className="text-3xl font-bold text-white">Movie<span className="text-yellow-500">dekho</span></p>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        style={{ position: 'absolute', top: '20px', right: '20px' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
            <Search onMovieSelect={handleMovieSelect} />
            {selectedMovie && <MovieDetails movie={selectedMovie} />}
            <PlaylistSection />
        </div>
    );
};

export default Home;
