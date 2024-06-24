import React, { createContext, useState, useEffect } from 'react';
// Importing necessary modules and hooks from React
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Importing routing components from react-router-dom
import Login from './components/Login';
// Importing the Login component
import HomePage from './components/HomePage';
// Importing the HomePage component
import PokemonDetails from './components/PokemonDetails';
// Importing the PokemonDetails component

// Defining a TypeScript type for the AuthContext
type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
};

// Creating an authentication context with a default value
export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
});

const App: React.FC = () => {
  // State to manage authentication status, initialized from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth') === 'true');

  // useEffect to handle changes in localStorage and update authentication status accordingly
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('auth') === 'true');
    };

    // Adding an event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Cleaning up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    // Providing the authentication context to child components
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <Router>
        <Routes>
          {/* Route for the login page */}
          <Route path="/login" element={<Login />} />
          {/* Route for the home page, redirects to login if not authenticated */}
          <Route path="/" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
          {/* Route for the Pokémon details page, redirects to login if not authenticated */}
          <Route path="/pokemon/:name" element={isAuthenticated ? <PokemonDetails /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

// Exporting the App component as the default export
export default App;
