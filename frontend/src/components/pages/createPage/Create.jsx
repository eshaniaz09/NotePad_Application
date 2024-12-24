import React, { useState } from 'react';
import Home from '../home_page/Home';
import './create.css';
import { useNavigate } from "react-router-dom";

function CreateNote() {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState(''); // "error" or "success"
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newNote = { title, note };

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        body: JSON.stringify(newNote),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Display an error message
        setAlertMessage(result.error || "Something went wrong!");
        setAlertType("error");
      } else {
        // Display a success message
        setAlertMessage("Note successfully created!");
        setAlertType("success");

        // Clear the form fields
        setTitle("");
        setNote("");

        // Redirect to the notes list or any other page
        setTimeout(() => {
          navigate("/all"); // Redirect after successful creation
        }, 2000);
      }

      // Clear the alert after 3 seconds
      setTimeout(() => {
        setAlertMessage('');
        setAlertType('');
      }, 3000);

    } catch (error) {
      console.error("Failed to submit data:", error);
      setAlertMessage("Failed to submit data. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <div>
      <Home />
      <div className="create-form-container">
        <h2 className="form-title">Create a New Note</h2>

        {/* Alert Box */}
        {alertMessage && (
          <div className={`alert-box ${alertType}`}>
            {alertMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the note title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">Note:</label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Enter the note content"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateNote;
