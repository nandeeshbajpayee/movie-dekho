import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const Authentication = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (isSignUp) {
            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                setLoading(false);
                return;
            }
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Ensure user is authenticated before writing to Firestore
                if (user) {
                    await setDoc(doc(firestore, 'users', user.uid), {
                        email: user.email,
                        username: email.split('@')[0], // Example username
                        createdAt: serverTimestamp(),
                        lists: [] // Initialize with an empty list array
                    });

                    navigate('/home'); // Redirect to home after successful signup
                }
            } catch (error) {
                console.error("Error signing up:", error);
                alert(error.message);
                setLoading(false);
            }
        } else {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Ensure user is authenticated before reading from Firestore
                if (user) {
                    const userDocRef = doc(firestore, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (!userDoc.exists()) {
                        await setDoc(userDocRef, {
                            email: user.email,
                            username: email.split('@')[0], // Example username
                            createdAt: serverTimestamp(),
                            lists: [] // Initialize with an empty list array
                        });
                    }

                    navigate('/home'); // Redirect to home after successful login
                }
            } catch (error) {
                console.error("Error logging in:", error);
                alert(error.message);
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <button
                        onClick={() => setIsSignUp(false)}
                        className={`px-4 py-2 rounded-md ${!isSignUp ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        disabled={loading}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsSignUp(true)}
                        className={`px-4 py-2 rounded-md ${isSignUp ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
                        disabled={loading}
                    >
                        Signup
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    {isSignUp && (
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="w-full p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : isSignUp ? 'Signup' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Authentication;




// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { auth } from '../firebaseConfig'; // Adjust the path based on your project structure
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// const Authentication = () => {
//     const [isSignUp, setIsSignUp] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true); // Set loading to true at the beginning of the form submission

//         if (isSignUp) {
//             if (password !== confirmPassword) {
//                 alert("Passwords do not match!");
//                 setLoading(false); // Reset loading state if there's an error
//                 return;
//             }
//             try {
//                 await createUserWithEmailAndPassword(auth, email, password);
//                 navigate('/home'); // Redirect to home after successful signup
//             } catch (error) {
//                 console.error("Error signing up:", error);
//                 alert(error.message);
//                 setLoading(false); // Reset loading state if there's an error
//             }
//         } else {
//             try {
//                 await signInWithEmailAndPassword(auth, email, password);
//                 navigate('/home'); // Redirect to home after successful login
//             } catch (error) {
//                 console.error("Error logging in:", error);
//                 alert(error.message);
//                 setLoading(false); // Reset loading state if there's an error
//             }
//         }
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-blue-700">
//             <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
//                 <div className="flex justify-center mb-6">
//                     <button
//                         onClick={() => setIsSignUp(false)}
//                         className={`px-4 py-2 rounded-md ${!isSignUp ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
//                         disabled={loading}
//                     >
//                         Login
//                     </button>
//                     <button
//                         onClick={() => setIsSignUp(true)}
//                         className={`px-4 py-2 rounded-md ${isSignUp ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
//                         disabled={loading}
//                     >
//                         Signup
//                     </button>
//                 </div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <input
//                             type="email"
//                             placeholder="Email Address"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <input
//                             type="password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className="w-full p-2 border border-gray-300 rounded-md"
//                         />
//                     </div>
//                     {isSignUp && (
//                         <div className="mb-4">
//                             <input
//                                 type="password"
//                                 placeholder="Confirm Password"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 required
//                                 className="w-full p-2 border border-gray-300 rounded-md"
//                             />
//                         </div>
//                     )}
//                     <button
//                         type="submit"
//                         className="w-full p-2 bg-blue-700 text-white rounded-md hover:bg-blue-800"
//                         disabled={loading}
//                     >
//                         {loading ? 'Processing...' : isSignUp ? 'Signup' : 'Login'}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Authentication;
