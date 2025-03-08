import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import '../styles/auth.css';
import Navbar from './Navbar'; 

const DocumentList = ({ navigateTo }) => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [uploadedFilter, setUploadedFilter] = useState('anytime');
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingDocument, setEditingDocument] = useState(null); // Track the document being edited
  const rowsPerPage = 5;

  const userRole = useSelector((state) => state.auth.role); // Get userRole from Redux store

  // Fetch documents from the backend
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/documents')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        return response.json();
      })
      .then((data) => {
        setDocuments(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load documents. Please try again later.');
        setLoading(false);
      });
  }, []);

  // Filter documents based on search term, category, and upload date
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesUploadDate = uploadedFilter === 'anytime' ||
      (uploadedFilter === 'latest' && new Date(doc.uploaded) > new Date(new Date() - 30 * 24 * 60 * 60 * 1000)) || // Last 30 days
      (uploadedFilter === 'earliest' && new Date(doc.uploaded) < new Date(new Date() - 365 * 24 * 60 * 60 * 1000)); // Older than 1 year

    return matchesSearch && matchesCategory && matchesUploadDate;
  });

  const pageCount = Math.ceil(filteredDocuments.length / rowsPerPage);

  // Reset page number if filtered data changes
  useEffect(() => {
    if (pageNumber >= pageCount && pageCount > 0) {
      setPageNumber(pageCount - 1);
    }
  }, [filteredDocuments.length, pageCount]);

  // Handlers for search, filters, and pagination
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleUploadedChange = (e) => setUploadedFilter(e.target.value);
  const handlePageChange = (newPage) => setPageNumber(newPage);

  // Get data for the current page
  const currentPageData = filteredDocuments.slice(pageNumber * rowsPerPage, (pageNumber + 1) * rowsPerPage);

  // Toggle selection of a single document
  const toggleDocumentSelection = (docId) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.includes(docId)
        ? prevSelected.filter((id) => id !== docId) // Deselect
        : [...prevSelected, docId] // Select
    );
  };



  // Toggle selection of all documents on the current page
  const toggleSelectAll = () => {
    const allIds = currentPageData.map((doc) => doc.id);
    if (selectedDocuments.length === allIds.length) {
      setSelectedDocuments([]); // Deselect all
    } else {
      setSelectedDocuments(allIds); // Select all
    }
  };

  // Handle document download
  const handleDownloadDocument = (docId) => {
    const document = documents.find((doc) => doc.id === docId);
    if (document) {
      window.open(document.downloadUrl, '_blank');
    }
  };

  // Handle document deletion
  const handleDeleteDocument = (docId) => {
    if (userRole !== 'admin') return; // Only allow admin to delete

    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    setDocuments(documents.filter((doc) => doc.id !== docId));

    fetch(`http://localhost:5000/documents/${docId}`, { method: 'DELETE' })
      .catch((error) => console.error('Error deleting document:', error));
  };

  // Handle bulk deletion
  const handleBulkDelete = () => {
    if (userRole !== 'admin') return; // Only allow admin to delete

    const confirmDelete = window.confirm('Are you sure you want to delete the selected documents?');
    if (!confirmDelete) return;

    setDocuments(documents.filter((doc) => !selectedDocuments.includes(doc.id)));
    setSelectedDocuments([]); // Clear selection

    // Delete from backend (if using an API)
    selectedDocuments.forEach((docId) => {
      fetch(`http://localhost:5000/documents/${docId}`, { method: 'DELETE' })
        .catch((error) => console.error('Error deleting document:', error));
    });
  };

  // Handle editing a document
  const handleEditDocument = (doc) => {
    setEditingDocument(doc); // Set the document to be edited
  };

  // Handle saving edited document
  const handleSaveEdit = (updatedDoc) => {
    setDocuments(documents.map((doc) =>
      doc.id === updatedDoc.id ? updatedDoc : doc
    ));

    fetch(`http://localhost:5000/documents/${updatedDoc.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDoc)
    }).catch((error) => console.error('Error updating document:', error));

    setEditingDocument(null); // Close the edit form
  };

  // Navigate to the user management page
  const handleUsersClick = () => {
    navigateTo('dashboard'); // Navigate to the user management page
  };

  // Navigate to the document upload page
  const handleUploadClick = () => {
    navigateTo('upload'); // Navigate to the document upload page
  };

  return (
    <div className="container">
      <Navbar
        userRole={userRole}
        navigateTo={navigateTo}
        currentPage="documents" // Pass the current page
      />
      <h2>Document Management</h2>

      {/* Search and Filters */}
      <div className="header-container">
        <input
          type="text"
          placeholder="Search document ..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        <div className="dropdown-container">
          <label className="dropdown-label">Category</label>
          <select value={categoryFilter} onChange={handleCategoryChange} className="dropdown">
            <option value="all">All</option>
            <option value="report">Report</option>
            <option value="invoice">Invoice</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="dropdown-container">
          <label className="dropdown-label">Uploaded</label>
          <select value={uploadedFilter} onChange={handleUploadedChange} className="dropdown">
            <option value="anytime">Anytime</option>
            <option value="latest">Last 30 Days</option>
            <option value="earliest">Older than 1 Year</option>
          </select>
        </div>
        <button className="new-user-btn" onClick={handleUploadClick}>+ Upload Document</button>
      </div>

      {/* Bulk Actions */}
      {selectedDocuments.length > 0 && userRole === 'admin' && (
        <div className="bulk-actions">
          <button className="delete-s-btn" onClick={handleBulkDelete}>
            ❌ Delete Selected ({selectedDocuments.length})
          </button>
        </div>
      )}

      {/* Loading and Error Messages */}
      {loading && <div className="loading">Loading documents...</div>}
      {error && <div className="error">{error}</div>}

      {/* Document Table */}
      <table className="document-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectedDocuments.length === currentPageData.length && currentPageData.length > 0}
                disabled={currentPageData.length === 0}
              />
            </th>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Uploaded</th>
            <th>Size</th>
            {userRole === 'admin' && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentPageData.length > 0 ? (
            currentPageData.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDocuments.includes(doc.id)}
                    onChange={() => toggleDocumentSelection(doc.id)}
                  />
                </td>
                <td>📝{doc.name}</td>
                <td>{doc.description}</td>
                <td>{doc.category}</td>
                <td>{doc.uploaded}</td>
                <td>{doc.size}</td>
                {userRole === 'admin' && (
                  <td>
                    <button className="edit-btn" onClick={() => handleEditDocument(doc)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDeleteDocument(doc.id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No documents found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Edit Document Modal */}
      {editingDocument && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Document</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedDoc = {
                  ...editingDocument,
                  name: e.target.name.value,
                  description: e.target.description.value,
                  category: e.target.category.value,
                };
                handleSaveEdit(updatedDoc);
              }}
            >
              <label>Name:</label>
              <input type="text" name="name" defaultValue={editingDocument.name} required />
              <label>Description:</label>
              <input type="text" name="description" defaultValue={editingDocument.description} required />
              <label>Category:</label>
              <select name="category" defaultValue={editingDocument.category}>
                <option value="report">Report</option>
                <option value="invoice">Invoice</option>
                <option value="contract">Contract</option>
              </select>
              <button className='save-btn' type="submit">Save</button>
              <button className='cancel-btn' type="button" onClick={() => setEditingDocument(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="pagination-container">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 0}
          className="pagination-arrow"
        >
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
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber === pageCount - 1}
          className="pagination-arrow"
        >
          &#8594;
        </button>
      </div>

      
    </div>
  );
};

export default DocumentList;