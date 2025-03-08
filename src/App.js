import React, { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import DocumentList from './components/DocumentList';
import UploadDocument from './components/UploadDocument'; // Import the UploadDocument component
import './styles.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  // Function to handle navigation between pages
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Function to handle successful login
  const handleLoginSuccess = (role, email) => {
    setUserRole(role);
    setUserEmail(email);
    setCurrentPage('dashboard');
  };

  // Function to handle logout
  const handleLogout = () => {
    setUserRole(null);
    setUserEmail(null);
    setCurrentPage('login');
  };

  return (
    <div className="App">
      

      {/* Page Content */}
      <div className="content">
        {currentPage === 'login' && (
          <Login onLoginSuccess={handleLoginSuccess} navigateTo={navigateTo} />
        )}
        {currentPage === 'signup' && (
          <Signup navigateTo={navigateTo} />
        )}
        {currentPage === 'dashboard' && (
          <Dashboard userRole={userRole} navigateTo={navigateTo} />
        )}
        {currentPage === 'documents' && (
          <DocumentList userRole={userRole} navigateTo={navigateTo} />
        )}
        {currentPage === 'upload' && (
          <UploadDocument navigateTo={navigateTo} />
        )}
      </div>
    </div>
  );
}

export default App;