import React, { useState, useEffect } from 'react';
import Home from "../home_page/Home";
import "./update.css";
import { useParams, useNavigate } from 'react-router-dom';

function Update() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // New state for success message
  const { id } = useParams();  // Get the ID from the URL
  const navigate = useNavigate();

  useEffect(() => {
    const getSingleNote = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error); // Show error if fetching fails
        } else {
          setTitle(result.data.title); // Ensure the result contains 'data'
          setNote(result.data.note);   // Same here for note
          setError(""); // Clear any existing error
        }
      } catch (error) {
        setError("Failed to fetch note data");
      }
    };

    if (id) {
      getSingleNote();
    }
  }, [id]);

  // Handle the form submit to update the note details
  const handleUpdate = async (e) => {
    e.preventDefault();
  
    // Get the current timestamp
    const currentTimestamp = new Date().toISOString(); // Get current time in ISO format
  
    const updatedNote = { 
      title, 
      note,
      timestamp: currentTimestamp // Add the current timestamp here
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        setError(result.error || "Failed to update note");
        setSuccessMessage(""); // Clear any success message if there's an error
      } else {
        setError(""); // Clear error if update succeeds
        setSuccessMessage("Note updated successfully!"); // Set the success message
        setTimeout(() => {
          navigate("/all"); // Redirect to the 'All Notes' page after 2 seconds
        }, 2000); // Delay for 2 seconds
      }
    } catch (error) {
      setError("Failed to update note");
      setSuccessMessage(""); // Clear any success message if there's an error
    }
  };
  

  return (
    <div>
      <Home />
      <div className="update-container">
        <h2>Update Note</h2>

        {error && <div className="error-message">{error}</div>}

        {successMessage && (
          <div className="success-message">{successMessage}</div> // Success message
        )}

        <form onSubmit={handleUpdate} className="update-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note:</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="update-button">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Update;
