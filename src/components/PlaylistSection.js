import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import playlisticon from './images/playlisticon.png';
import createplaylist from './images/createplaylist2.png';
import { firestore, auth } from '../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";

function PlaylistSection() {
    const [publicPlaylists, setPublicPlaylists] = useState([]);
    const [userPlaylists, setUserPlaylists] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const publicPlaylistsQuery = query(collection(firestore, 'lists'), where('visibility', '==', 'public'));
                const publicPlaylistsSnapshot = await getDocs(publicPlaylistsQuery);
                const publicPlaylistsData = publicPlaylistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPublicPlaylists(publicPlaylistsData);

                if (user) {
                    const userPlaylistsQuery = query(collection(firestore, 'lists'), where('userId', '==', user.uid));
                    const userPlaylistsSnapshot = await getDocs(userPlaylistsQuery);
                    const userPlaylistsData = userPlaylistsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setUserPlaylists(userPlaylistsData);
                }
            } catch (error) {
                console.error("Error fetching playlists: ", error);
                setError(error.message);
            }
        };

        fetchPlaylists();
    }, [user]);

    return (
        <div className="playlistSection text-center">
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex flex-wrap justify-center gap-6">
                <Link to="/createlist">
                    <div className="flex flex-col items-center p-4 mx-2 my-12 border-4 border-gray-300 rounded-lg w-40 hover:scale-105 transform transition duration-300">
                        <img src={createplaylist} alt="createplaylist" className="w-12 h-12" />
                        <h3 className="mt-2 text-lg font-medium text-gray-300"><b>Create playlist</b></h3>
                    </div>
                </Link>
                <div className="w-full mb-8">
                    <h2 className="text-3xl font-semibold my-6 text-yellow-500">Public Playlists</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {publicPlaylists.length > 0 ? (
                            publicPlaylists.map(playlist => (
                                <Link to={`/movies?playlistName=${encodeURIComponent(playlist.name)}`} key={playlist.id}>
                                    <div className="flex flex-col items-center p-4 mx-2 my-12 border border-gray-300 rounded-lg w-40 hover:scale-105 transform transition duration-300">
                                        <img src={playlisticon} alt="Playlist Icon" className="w-12 h-12" />
                                        <h3 className="mt-2 text-lg font-medium text-yellow-500">{playlist.name}</h3>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="text-gray-300 text-2xl">No public playlists available</p>
                        )}
                    </div>
                </div>
                <div className="w-full mb-8">
                    <h2 className="text-3xl font-semibold my-6 text-yellow-500">Private Playlists</h2>
                    <div className="flex flex-wrap justify-center gap-6">
                        {userPlaylists.length > 0 ? (
                            userPlaylists.map(playlist => (
                                <div key={playlist.id} className="relative flex flex-col items-center p-4 mx-2 my-12 border border-gray-300 rounded-lg w-40 hover:scale-105 transform transition duration-300">
                                    <Link to={`/movies?playlistName=${encodeURIComponent(playlist.name)}`}>
                                        <img src={playlisticon} alt="Playlist Icon" className="w-12 h-12" />
                                        <h3 className="mt-2 text-lg font-medium text-yellow-500">{playlist.name}</h3>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-300 text-2xl">You have no playlists</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaylistSection;
