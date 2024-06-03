import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebaseConfig'; // Import auth from firebaseConfig
import { doc, addDoc, updateDoc, getDoc, arrayUnion, arrayRemove, collection, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Search from './Search'; // Import the Search component

const CreateListPage = () => {
    const [listName, setListName] = useState('');
    const [visibility, setVisibility] = useState('public'); // Default visibility is public
    const [selectedMovies, setSelectedMovies] = useState([]);
    const [listId, setListId] = useState(null);
    const [user, setUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // State to track form submission
    const navigate = useNavigate();
    const apiKey = process.env.REACT_APP_OMDB_API_KEY;

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login'); // Redirect to login if not authenticated
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (listId) {
            const fetchList = async () => {
                try {
                    const docRef = doc(firestore, 'lists', listId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        setSelectedMovies(data.movies || []);
                    }
                } catch (error) {
                    console.error("Error fetching list data: ", error);
                }
            };
            fetchList();
        }
    }, [listId]);

    const handleMovieSelect = async (imdbID) => {
        if (listId) {
            // Add the selected movie's IMDb ID to the Firestore collection
            const docRef = doc(firestore, 'lists', listId);
            await updateDoc(docRef, {
                movies: arrayUnion(imdbID)
            }).then(() => {
                console.log("Movie added to the list successfully!");
                setSelectedMovies([...selectedMovies, imdbID]);
            }).catch((error) => {
                console.error("Error adding movie to the list:", error);
            });
        } else {
            setSelectedMovies([...selectedMovies, imdbID]);
        }
    };

    const handleMovieRemove = async (imdbID) => {
        if (listId) {
            // Remove the selected movie's IMDb ID from the Firestore collection
            const docRef = doc(firestore, 'lists', listId);
            await updateDoc(docRef, {
                movies: arrayRemove(imdbID)
            }).then(() => {
                console.log("Movie removed from the list successfully!");
                setSelectedMovies(selectedMovies.filter(movie => movie !== imdbID));
            }).catch((error) => {
                console.error("Error removing movie from the list:", error);
            });
        } else {
            setSelectedMovies(selectedMovies.filter(movie => movie !== imdbID));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('User not authenticated');
            return;
        }
        if (isSubmitting) {
            return; // Prevent multiple submissions
        }
        setIsSubmitting(true); // Set the submitting state to true

        try {
            const docRef = await addDoc(collection(firestore, 'lists'), {
                userId: user.uid,
                name: listName,
                visibility: visibility,
                movies: selectedMovies,
                createdAt: serverTimestamp()
            });
            setListId(docRef.id);
            console.log("List created with ID: ", docRef.id);

            // Add list ID to the user's document
            const userDocRef = doc(firestore, 'users', user.uid);
            await updateDoc(userDocRef, {
                lists: arrayUnion(docRef.id)
            });

            navigate('/home'); // Redirect to home after successful list creation
        } catch (error) {
            console.error("Error creating list: ", error);
            if (error.code === 'permission-denied') {
                alert("You do not have permission to create this list. Please check your Firestore rules.");
            }
        } finally {
            setIsSubmitting(false); // Reset the submitting state
        }
    };

    return (
        <div className="container mx-auto px-4 bg-slate-800 min-h-screen">
            <h1 className="text-3xl font-bold text-white mb-4">Create Movie List</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="List Name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        required
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <Search onMovieSelect={handleMovieSelect} />
                {/* Display the selected movies */}
                <div className="mt-4">
                    {selectedMovies.map((imdbID, index) => (
                        <div key={index} className="flex items-center p-2 border-b border-gray-300">
                            <img
                                src={`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`}
                                alt={imdbID}
                                className="w-12 h-16 object-cover mr-2"
                            />
                            <p className="text-white">{imdbID}</p>
                            <button
                                onClick={() => handleMovieRemove(imdbID)}
                                className="ml-auto text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="submit"
                    className={`w-full p-2 ${isSubmitting ? 'bg-gray-500' : 'bg-yellow-500'} text-white rounded-md hover:bg-yellow-600 mt-4`}
                    disabled={isSubmitting} // Disable the button during form submission
                >
                    {isSubmitting ? 'Creating...' : 'Create List'}
                </button>
            </form>
        </div>
    );
};

export default CreateListPage;
