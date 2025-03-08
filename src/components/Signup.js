import React, { useState } from 'react';
import '../styles/auth.css';

const Signup = ({ navigateTo }) => {  // Receiving navigateTo as a prop
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('user');  // Default role is 'user'
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!fullName || !email || !password || !location) {
      setError('All fields are required.');
      return;
    }
  
    const newUser = {
      fullName,
      email,
      location,
      joined: new Date().toISOString().split('T')[0], // Current date (YYYY-MM-DD)
      permissions: role,
      status: "active",
    };
  
    try {
      const response = await fetch("http://localhost:5000/users", {  // Replace with your API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
  
      if (response.ok) {
        navigateTo('dashboard');  // Redirect on success
      } else {
        setError("Failed to create user.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };
  

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Create User Account</h2>
        <p className="subheading">Add users to your DMS</p>

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Form Inputs */}
        <form className="auth-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="select-wrapper">
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="user">User ▼</option>
              <option value="admin">Admin ▼</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">Create Account</button>
        </form>

        <button className="back-btn" onClick={() => navigateTo('dashboard')}>
          Return to Dashboard
        </button>

        <footer>© 2025 All rights reserved.</footer>
      </div>
    </div>
  );
};

export default Signup;
