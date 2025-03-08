import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../styles.css';
import Navbar from './Navbar'; 


const Dashboard = ({ navigateTo }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [permissionsFilter, setPermissionsFilter] = useState('all');
  const [joinedFilter, setJoinedFilter] = useState('anytime');
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const rowsPerPage = 6;

  const userRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const filteredData = data
    .filter((item) => {
      return (
        (item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (permissionsFilter === 'all' || item.permissions.toLowerCase() === permissionsFilter.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (joinedFilter === 'latest') {
        return new Date(b.joined) - new Date(a.joined); // Sort by latest joined
      } else if (joinedFilter === 'earliest') {
        return new Date(a.joined) - new Date(b.joined); // Sort by earliest joined
      } else {
        return 0; // No sorting if "anytime" is selected
      }
    });

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  useEffect(() => {
    if (pageNumber >= pageCount && pageCount > 0) {
      setPageNumber(pageCount - 1);
    }
  }, [filteredData.length, pageCount]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handlePermissionsChange = (e) => setPermissionsFilter(e.target.value);
  const handleJoinedChange = (e) => setJoinedFilter(e.target.value);
  const handlePageChange = (newPage) => setPageNumber(newPage);

  const currentPageData = filteredData.slice(pageNumber * rowsPerPage, (pageNumber + 1) * rowsPerPage);
  const toggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) => {
      if (prevSelected.includes(userId)) {
        return prevSelected.filter((id) => id !== userId); // Deselect user
      } else {
        return [...prevSelected, userId]; // Select user
      }
    });
  };

  const toggleSelectAll = () => {
    const allIds = currentPageData.map(user => user.id);
    if (selectedUsers.length === allIds.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(allIds); // Select all
    }
  };

  // Handle status change (active/inactive)
  const handleStatusChange = (userId, newStatus) => {
    setData(data.map(user =>
      user.id === userId ? { ...user, status: newStatus } : user
    ));

    fetch(`http://localhost:5000/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).catch(error => console.error('Error updating status:', error));
  };

  // Handle editing a user
  const handleEditUser = (user) => {
    setEditingUser(user); // Set the user to be edited
  };

  // Handle saving edited user
  const handleSaveEdit = (updatedUser) => {
    setData(data.map(user =>
      user.id === updatedUser.id ? updatedUser : user
    ));

    fetch(`http://localhost:5000/users/${updatedUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    }).catch(error => console.error('Error updating user:', error));

    setEditingUser(null); // Close the edit form
  };



  return (
    <div className="container">
       <Navbar
        userRole={userRole}
        navigateTo={navigateTo}
        currentPage="dashboard" // Pass the current page
      />
      <h2>User Management</h2>
      <p className="subheading">Make sure you read ReadMe file to retrieve data</p>

      <div className="header-container">
        <input type="text" placeholder="Search user ..." value={searchTerm} onChange={handleSearchChange} className="search-input" />
        <div className="dropdown-container">
          <label className="dropdown-label">Permissions</label>
          <select value={permissionsFilter} onChange={handlePermissionsChange} className="dropdown">
            <option value="all">All</option>
            <option value="admin">Admin</option>
            <option value="contributor">Contributor</option>
          </select>
        </div>

        <div className="dropdown-container">
          <label className="dropdown-label">Joined</label>
          <select value={joinedFilter} onChange={handleJoinedChange} className="dropdown">
            <option value="anytime">Anytime</option>
            <option value="latest">Latest</option>
            <option value="earliest">Earliest</option>
          </select>
        </div>

        {userRole === 'admin' && <button className="new-user-btn" onClick={() => navigateTo('signup')}>+ Add User</button>}
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" onChange={toggleSelectAll} checked={selectedUsers.length === currentPageData.length} />
            </th>
            <th>Full Name</th>
            <th>Email Address</th>
            <th>Location</th>
            <th>Joined</th>
            <th>Permissions</th>
            <th>Status</th>
            {userRole === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((user) => (
              <tr key={user.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUserSelection(user.id)}
                  />
                </td>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>📍 {user.location}</td>
                <td>{user.joined}</td>
                <td>{user.permissions}</td>
                <td>
                  <span className={`status-badge ${user.status}`}>
                    {user.status}
                  </span>
                </td>
                {userRole === 'admin' && (
                  <td>
                    {user.status === "active" ? (
                      <button className="deactivate-btn" onClick={() => handleStatusChange(user.id, "inactive")}>
                        Deactivate
                      </button>
                    ) : (
                      <button className="activate-btn" onClick={() => handleStatusChange(user.id, "active")}>
                        Activate
                      </button>
                    )}
                    <button className="edit-btn" onClick={() => handleEditUser(user)}>
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr><td colSpan="8">No users found</td></tr>
          )}
        </tbody>
      </table>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedUser = {
                  ...editingUser,
                  fullName: e.target.fullName.value,
                  email: e.target.email.value,
                  location: e.target.location.value,
                  permissions: e.target.permissions.value,
                };
                handleSaveEdit(updatedUser);
              }}
            >
              <label>Full Name:</label>
              <input type="text" name="fullName" defaultValue={editingUser.fullName} required />
              <label>Email:</label>
              <input type="email" name="email" defaultValue={editingUser.email} required />
              <label>Location:</label>
              <input type="text" name="location" defaultValue={editingUser.location} required />
              <label>Permissions:</label>
              <select name="permissions" defaultValue={editingUser.permissions}>
                <option value="admin">Admin</option>
                <option value="contributor">Contributor</option>
              </select>
              <button className='save-btn' type="submit">Save</button>
              <button className='cancel-btn' type="button" onClick={() => setEditingUser(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      <div className="pagination-container">
        <button onClick={() => handlePageChange(pageNumber - 1)} disabled={pageNumber === 0} className="pagination-arrow">
          &#8592;
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((number, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(number - 1)}
            className={`pagination-button ${pageNumber === number - 1 ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
        <button onClick={() => handlePageChange(pageNumber + 1)} disabled={pageNumber === pageCount - 1} className="pagination-arrow">
          &#8594;
        </button>
      </div>

     
    </div>
  );
};

export default Dashboard;
