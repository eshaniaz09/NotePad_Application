const express = require("express");
const mongoose = require("mongoose");
const Note = require("../models/noteModel");
const router = express.Router();

// Validate ObjectId format
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new note
router.post("/", async (req, res) => {
  try {
    const { title, note } = req.body;
    const newNote = new Note({ title, note });
    await newNote.save();
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create note",
      error: error.message,
    });
  }
});

// Get all notes

router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 }); // Sort by createdAt descending
    res.status(200).json({ success: true, data: notes });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
});


// Get a single note by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  
  // Check if the id is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch note",
      error: error.message,
    });
  }
});

// Update a note by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the id is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  const { title, note } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { 
        title, 
        note, 
      },
      { 
        new: true,  // Ensures the updated document is returned
        runValidators: true 
      }
    );

    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: updatedNote,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update note",
      error: error.message,
    });
  }
});





// Delete a note by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // Check if the id is valid
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.status(200).json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete note",
      error: error.message,
    });
  }
});

module.exports = router;
