import React from 'react';
import { FaUserCircle, FaBell } from 'react-icons/fa'; // Import icons from react-icons
import '../styles.css';
import { useDispatch } from 'react-redux';



const Navbar = ({ userRole, navigateTo, currentPage }) => {
 const dispatch = useDispatch();

  // Logout function
  const handleLogout = () => {
   dispatch({ type: 'LOGOUT' }); // Dispatch logout action
   navigateTo('login'); // Navigate to the login page
 };
  return (
    <nav className="navbar">
      {/* Left Side: Profile and Notifications */}
      <div className="navbar-left">
        <div className="profile-icon">
          <FaUserCircle size={24} />
        </div>
        <div className="notifications-icon">
          <FaBell size={24} />
          <span className="notification-count">3</span> {/* Example notification count */}
        </div>
      </div>

      {/* Right Side: Navigation Buttons */}
      <div className="navbar-right">
      <div>
        {currentPage === 'dashboard' && (
          <button className="new-user-btn" onClick={() => navigateTo('documents')}>
            Documents
          </button>
          
        )}
        {currentPage === 'documents' && (
          <button className="new-user-btn" onClick={() => navigateTo('dashboard')}>
            Users
          </button>
        )}
      </div>
      <div className="navbar-right">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      </div>
    </nav>
  );
};

export default Navbar;