import React, { useState, useEffect } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import HamburgerMenu from "./hamburger/HamburgerMenu.jsx";

const Home = () => {
  const navigate = useNavigate();
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch("/api/notes");
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleCreateClick = () => {
    navigate("/create");
  };

  const handleUpdateClick = (id) => {
    navigate(`/update/${id}`);
  };

  const handleReadClick = () => {
    navigate("/all");
  };

  const handleDeleteClick = async (id) => {
    try {
      await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const toggleHamburger = () => {
    setShowHamburgerMenu(!showHamburgerMenu);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar-parent">
        <div>
          <b>Notepad</b>
        </div>

        <div className="pages">
          <ul className="pages-ul">
            <li onClick={handleCreateClick} className="pages-ul-li">
              Create Note
              <span className="pages-ul-li-underliningItems"></span>
            </li>
            <li onClick={handleReadClick} className="pages-ul-li">
              All Notes
              <span className="pages-ul-li-underliningItems"></span>
            </li>
            <li onClick={handleUpdateClick} className="pages-ul-li">
              Update
              <span className="pages-ul-li-underliningItems"></span>
            </li>
          </ul>
        </div>

        <div className="hamburger">
          <button
            onClick={toggleHamburger}
            className="hamburger-button"
            aria-label="Toggle Menu"
          >
            <div className={`icon-wrapper ${showHamburgerMenu ? "open" : ""}`}>
              {!showHamburgerMenu ? (
                <GiHamburgerMenu className="hamburger-icon" />
              ) : (
                <AiOutlineClose className="close-icon" />
              )}
            </div>
          </button>
        </div>
      </nav>

      {showHamburgerMenu && (
        <div className="hamburger-menu open">
          <HamburgerMenu />
        </div>
      )}

      {/* Notes Section */}
      <div className="notes-section">
        <ul>
          {notes.map((note) => (
            <li key={note._id} className="note-item">
              <div className="note-content">
                <p>{note.title}</p>
                <button onClick={() => handleUpdateClick(note._id)}>Update</button>
                <button onClick={() => handleDeleteClick(note._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home;
