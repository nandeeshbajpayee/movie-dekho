import React, { useState, useEffect } from 'react';
import { Oval } from 'react-loader-spinner';
import { firestore } from '../firebaseConfig';
import { collection, getDocs, query as firestoreQuery, where } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function Movies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const query = useQuery();
    const listName = query.get('playlistName');
    const auth = getAuth();
    const user = auth.currentUser;

    console.log("List Name:", listName);
    console.log("User:", user);

    useEffect(() => {
        const fetchMovies = async () => {
            if (!listName) {
                setError("List name is not provided.");
                setLoading(false);
                return;
            }

            try {
                console.log(`Fetching movies for list: ${listName}`);
                const listsCollection = collection(firestore, 'lists');
                console.log(listsCollection)
                const q = firestoreQuery(listsCollection, where('name', '==', listName));
                const listsSnapshot = await getDocs(q);
                if (listsSnapshot.empty) {
                    throw new Error('No list found with the specified name');
                }

                let allMovies = [];
                let listVisibility = 'private';
                let listOwnerId = null;

                listsSnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    listVisibility = data.visibility;
                    listOwnerId = data.userId;
                    if (data.movies) {
                        allMovies = data.movies;
                    }
                });

                console.log("List Visibility:", listVisibility);
                console.log("List Owner ID:", listOwnerId);
                console.log("All Movies:", allMovies);

                if (listVisibility !== 'public' && (!user || user.uid !== listOwnerId)) {
                    throw new Error('You do not have permission to view this list');
                }

                const moviesData = await Promise.all(
                    allMovies.map(async (imdbID) => {
                        try {
                            const apiKey = process.env.REACT_APP_OMDB_API_KEY;
                            const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
                            if (!response.ok) {
                                throw new Error('Failed to fetch movie data');
                            }
                            const movie = await response.json();
                            return movie;
                        } catch (error) {
                            console.error("Error fetching movie data: ", error);
                            // Handle error if needed
                            return null; // Return null for this movie if there's an error
                        }
                    })
                );


                console.log("Movies Data:", moviesData);

                setMovies(moviesData);
            } catch (error) {
                console.error("Error fetching movies: ", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [listName, user, query]); // Add user and query to the dependency array

    return (
        <div className='bg-gray-800 min-h-screen p-8'>
            <div className='mb-8'>
                <div className='mt-8 mb-8 font-bold text-2xl text-center text-white'>{listName ? `${listName} Movies` : 'Movies'}</div>
                {loading ? (
                    <div className='flex justify-center'>
                        <Oval
                            height={80}
                            width={80}
                            color='grey'
                            secondaryColor='grey'
                            ariaLabel='loading'
                            className='mt-4'
                        />
                    </div>
                ) : error ? (
                    <div className='text-center text-red-500'>{error}</div>
                ) : (
                    <div className='flex flex-wrap justify-center'>
                        {movies.map((movie) => (
                            <div
                                key={movie.imdbID}
                                style={{ backgroundImage: `url(${movie.Poster})` }}
                                className={`h-[25vh] w-[150px] md:h-[35vh] md:w-[200px] bg-center bg-cover rounded-xl flex items-end m-4 hover:scale-110 ease-out duration-300 relative`}
                            >
                                <div className='px-1 text-white py-2 bg-gray-900 w-full flex justify-center rounded-b-xl font-bold text-xl'>
                                    {movie.Title}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Movies;
