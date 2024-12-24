import React, { useEffect, useState } from "react";
import Home from "../home_page/Home";
import "./read.css";
import { useNavigate } from "react-router-dom";

// Helper function to format date
const formatDate = (date) => new Date(date).toLocaleString();

// Helper function to compare if two dates are the same day (ignoring time)
const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.toDateString() === d2.toDateString();
};

// Helper function to check if a date is within the last week (7-14 days ago)
const isLastWeek = (date) => {
  const today = new Date();
  const updatedDate = new Date(date);
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 14);

  return updatedDate >= twoWeeksAgo && updatedDate < oneWeekAgo;
};

// Helper function to check if a date is within the last month (30-60 days ago)
const isLastMonth = (date) => {
  const today = new Date();
  const updatedDate = new Date(date);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  return updatedDate >= twoMonthsAgo && updatedDate < oneMonthAgo;
};

function Read() {
  const navigate = useNavigate();
  const [data, setData] = useState([]); // Initialize as an empty array
  const [error, setError] = useState(""); // Holds error message
  const [successMessage, setSuccessMessage] = useState(""); // Holds success message

  // Fetch data from the backend for notes
  async function getData() {
    try {
      const response = await fetch("http://localhost:5000/api/notes");
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred while fetching notes.");
      } else {
        setError(""); // Clear any existing errors
        // Sort notes by updatedAt in descending order before setting state
        const sortedData = result.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setData(sortedData); // Set sorted data to the state
      }
    } catch (error) {
      setError("Failed to fetch data. Please try again.");
    }
  }

  useEffect(() => {
    getData(); // Fetch data when the component mounts
  }, []);

  // Delete function for notes
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred while deleting the note.");
      } else {
        setSuccessMessage("Deleted Successfully");
        getData(); // Re-fetch the data after deletion
        setTimeout(() => {
          setSuccessMessage(""); // Clear success message after 2 seconds
        }, 2000);
      }
    } catch (error) {
      setError("Failed to delete the note. Please try again.");
    }
  };

  // Edit function (navigate to the update page)
  const handleEdit = (id) => {
    navigate(`/update/${id}`); // Redirect to the update page with the note's ID as a URL parameter
  };

  // Categorize notes and sort them by updatedAt (most recent first)
  const todayNotes = data
    .filter((note) => isSameDay(note.updatedAt, new Date()))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const lastWeekNotes = data
    .filter((note) => isLastWeek(note.updatedAt))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const lastMonthNotes = data
    .filter((note) => isLastMonth(note.updatedAt))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const olderNotes = data
    .filter(
      (note) =>
        !isSameDay(note.updatedAt, new Date()) &&
        !isLastWeek(note.updatedAt) &&
        !isLastMonth(note.updatedAt)
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div>
      <Home />
      {/* Display error message at the top if any */}
      {error && <div className="error-message">{error}</div>}

      {/* Display the success message at the top */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <div className="content-container">
        {/* Today's Notes Section */}
        <div className="section">
          <h2>Today's Notes</h2>
          {todayNotes.length > 0 ? (
            <div className="card-container">
              {todayNotes.map((note) => (
                <div key={note._id} className="user-card">
                  <div className="card-content">
                    <h3 className="user-name">{note.title}</h3>
                    <p className="user-note">{note.note}</p>
                    <p className="timestamp">
                      {note.updatedAt
                        ? formatDate(note.updatedAt)
                        : formatDate(note.createdAt)}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(note._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No notes for today</p>
          )}
        </div>

        {/* Last Week's Notes Section */}
        <div className="section">
          <h2>Last Week's Notes</h2>
          {lastWeekNotes.length > 0 ? (
            <div className="card-container">
              {lastWeekNotes.map((note) => (
                <div key={note._id} className="user-card">
                  <div className="card-content">
                    <h3 className="user-name">{note.title}</h3>
                    <p className="user-note">{note.note}</p>
                    <p className="timestamp">
                      {note.updatedAt
                        ? formatDate(note.updatedAt)
                        : formatDate(note.createdAt)}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(note._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No notes from last week</p>
          )}
        </div>

        {/* Last Month's Notes Section */}
        <div className="section">
          <h2>Last Month's Notes</h2>
          {lastMonthNotes.length > 0 ? (
            <div className="card-container">
              {lastMonthNotes.map((note) => (
                <div key={note._id} className="user-card">
                  <div className="card-content">
                    <h3 className="user-name">{note.title}</h3>
                    <p className="user-note">{note.note}</p>
                    <p className="timestamp">
                      {note.updatedAt
                        ? formatDate(note.updatedAt)
                        : formatDate(note.createdAt)}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(note._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No notes from last month</p>
          )}
        </div>

        {/* Older Notes Section */}
        <div className="section">
          <h2>Older Notes</h2>
          {olderNotes.length > 0 ? (
            <div className="card-container">
              {olderNotes.map((note) => (
                <div key={note._id} className="user-card">
                  <div className="card-content">
                    <h3 className="user-name">{note.title}</h3>
                    <p className="user-note">{note.note}</p>
                    <p className="timestamp">
                      {note.updatedAt
                        ? formatDate(note.updatedAt)
                        : formatDate(note.createdAt)}
                    </p>
                  </div>
                  <div className="card-actions">
                    <button
                      onClick={() => handleEdit(note._id)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No older notes</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Read;
