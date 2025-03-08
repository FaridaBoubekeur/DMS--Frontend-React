import React, { useState } from 'react';
import '../styles.css';

const DocumentDetails = ({ document, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedMetadata, setUpdatedMetadata] = useState({
    title: document.title,
    author: document.author,
    date: document.date,
  });

  const handleSaveMetadata = () => {
    onUpdate(document.id, updatedMetadata);
    setEditMode(false);
  };

  return (
    <div className="document-details">
      <h3>Document Details</h3>
      {editMode ? (
        <div>
          <input
            type="text"
            value={updatedMetadata.title}
            onChange={(e) => setUpdatedMetadata({ ...updatedMetadata, title: e.target.value })}
          />
          <input
            type="text"
            value={updatedMetadata.author}
            onChange={(e) => setUpdatedMetadata({ ...updatedMetadata, author: e.target.value })}
          />
          <input
            type="date"
            value={updatedMetadata.date}
            onChange={(e) => setUpdatedMetadata({ ...updatedMetadata, date: e.target.value })}
          />
          <button onClick={handleSaveMetadata} className="save-button">Save</button>
        </div>
      ) : (
        <div>
          <p><strong>Title:</strong> {document.title}</p>
          <p><strong>Author:</strong> {document.author}</p>
          <p><strong>Date:</strong> {document.date}</p>
          <button onClick={() => setEditMode(true)} className="edit-button">Edit Metadata</button>
        </div>
      )}
    </div>
  );
};

export default DocumentDetails;
