import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../styles/auth.css';

const Login = ({ navigateTo }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('admin'); // Default role is 'admin'

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Selected Role:", role);  // Debugging output

    const hardcodedUsers = [
      { username: 'admin', password: 'pass123', role: 'admin' },
      { username: 'user', password: 'userpass', role: 'contributor' }
    ];

    // Find the user in the hardcoded list
    const validUser = hardcodedUsers.find(
      (user) => user.username === username && user.password === password
    );

    if (validUser) {
      console.log("Found user:", validUser);
      if (validUser.role === role) {
        dispatch({ type: 'LOGIN', payload: { username, role: validUser.role } });
        navigateTo('dashboard');
      } else {
        setError("Selected role does not match credentials");
      }
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <p className="subheading">Welcome back! Please log in to your account.</p>

        <form className="auth-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          {/* Forgot Password */}
          <p className="forgot-password">
            Forgot password? <a href="#">Contact HR.</a>
          </p>

          {/* Dropdown for Role Selection */}
          <div className="dropdown-container1">
            <label htmlFor="role">Login as?</label>
            <select
              id="role"
              value={role}
              onChange={(e) => {
                console.log("Role changed to:", e.target.value); // Debugging output
                setRole(e.target.value);
              }}
              className="dropdown"
            >
              <option value="admin">Admin</option>
              <option value="contributor">Contributor</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">Log in</button>
        </form>

        {error && <p className="error">{error}</p>}

        <footer>© 2025 All rights reserved.</footer>
      </div>
    </div>
  );
};

export default Login;