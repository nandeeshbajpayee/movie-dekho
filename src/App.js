// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './components/Authentication';
import Home from './components/Home';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import CreateListPage from './components/CreateListPage';
import Movies from './components/Movies';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/movies" element={<Movies />} />
          {/* <Route path="/p" element={<PlaylistSection />} /> */}
          <Route path="/createlist" element={<CreateListPage />} />
          <Route path="/home" element={<PrivateRoute element={Home} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
