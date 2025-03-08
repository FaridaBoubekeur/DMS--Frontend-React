import React, { useState } from 'react';
import '../styles.css';

const UploadDocument = ({ navigateTo }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('report');
  const [file, setFile] = useState(null); // Store the uploaded file
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description || !category || !file) {
      setError('Please fill out all fields and select a file.');
      return;
    }

    // Simulate saving file metadata to json-server
    const newDocument = {
      name,
      description,
      category,
      uploaded: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      size: `${(file.size / 1024).toFixed(2)} KB`, // File size in KB
      fileName: file.name, // Store the file name
    };

    try {
      const response = await fetch('http://localhost:5000/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDocument),
      });

      if (!response.ok) {
        throw new Error('Failed to upload document metadata');
      }

      setSuccess('Document uploaded successfully!');
      setError('');
      setName('');
      setDescription('');
      setCategory('report');
      setFile(null);

      // Optionally, navigate back to the document list after a delay
      setTimeout(() => {
        navigateTo('documents');
      }, 2000);
    } catch (error) {
      console.error('Error uploading document:', error);
      setError('Failed to upload document. Please try again.');
    }
  };

  return (
    <div className="container">
      
      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="upload-form">
      <h2>Upload Document</h2>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="report">Report</option>
            <option value="invoice">Invoice</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="form-group">
          <label>File:</label>
          <input
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-btn">Upload</button>
        <button className="back-btn" onClick={() => navigateTo('documents')}>
         Back to Documents
      </button>
      </form>
      
    </div>
  );
};

export default UploadDocument;