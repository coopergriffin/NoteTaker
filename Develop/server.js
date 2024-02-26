const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));



// API Routes

// Read notes from the db.json file
app.get('/api/notes', (req, res) => {
    console.log("Hello2")
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    console.log("bye4")
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to read notes' });
      return;
    }
    res.json(JSON.parse(data));
  });
});

// Add a new note to the db.json file
app.post('/api/notes', (req, res) => {
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
app.delete('/api/notes/:id', (req, res) => {
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

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
  });
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
