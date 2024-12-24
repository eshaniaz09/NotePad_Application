import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Create from "./components/pages/createPage/Create.jsx";
import Update from "./components/pages/updatePage/Update.jsx";
import Read from "./components/pages/readPage/Read.jsx";

const App = () => {
  return (
    <Router>
      <Routes>

        {/* Page for creating a new note */}
        <Route path="/create" element={<Create />} />

        {/* Page for reading and listing all notes */}
        <Route path="/all" element={<Read />} />

        {/* Page for updating a specific note by ID */}
        <Route path="/update/:id" element={<Update />} />

        {/* Route not found, redirecting to /create */}
        <Route path="*" element={<Navigate to="/create" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
