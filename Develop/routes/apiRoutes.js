const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbFilePath = path.join(__dirname, '..', 'db', 'db.json');

// Read notes from the db.json file
router.get('/notes', (req, res) => {
    console.log("Hasdfa");
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes' });
        return;
      }
      console.log("Data from db.json:", data); // Log the data here
      res.json(JSON.parse(data));
    });
  });

// Add a new note to the db.json file
router.post('/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    res.status(400).json({ error: 'Title and text are required' });
    return;
  }

  const newNote = {
    id: uuidv4(),
    title,
    text
  };

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile(dbFilePath, JSON.stringify(notes, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save note' });
        return;
      }
      res.json(newNote);
    });
  });
});

// Delete a note from the db.json file
router.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }

    const notes = JSON.parse(data);
    const filteredNotes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(dbFilePath, JSON.stringify(filteredNotes, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete note' });
        return;
      }
      res.json({ message: 'Note deleted successfully' });
    });
  });
});

module.exports = router;
