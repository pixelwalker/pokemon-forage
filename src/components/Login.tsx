import React, { useState, useContext } from 'react';
// Importing necessary modules and hooks from React
import { useNavigate } from 'react-router-dom';
// Importing the useNavigate hook from react-router-dom for navigation
import { AuthContext } from '../App';
// Importing the AuthContext from the App component to access authentication state

const Login: React.FC = () => {
  // State to manage the username input
  const [username, setUsername] = useState('');
  // State to manage the password input
  const [password, setPassword] = useState('');
  // Hook for programmatic navigation
  const navigate = useNavigate();
  // Destructuring the setIsAuthenticated function from the AuthContext
  const { setIsAuthenticated } = useContext(AuthContext);

  // Function to handle the login process
  const handleLogin = () => {
    // Check if the entered username and password are correct
    if (username === 'user' && password === 'password') {
      // Set the authentication status in localStorage
      localStorage.setItem('auth', 'true');
      // Update the authentication context state
      setIsAuthenticated(true);
      // Navigate to the home page
      navigate('/');
    } else {
      // Show an alert for invalid credentials
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <input
          type="text"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="w-full p-2 mb-4 border rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full p-2 bg-blue-500 text-white rounded" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
