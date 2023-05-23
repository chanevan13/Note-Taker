const fs = require('fs');
const express = require('express');
const uniqid = require('uniqid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.json());

const dbPath = './db/db.json';

// Helper function to save data to db.json
function saveData(data) {
  fs.writeFile(dbPath, JSON.stringify(data), err => {
    if (err) {
      console.log(err);
    }
  });
}

// Routes

// Serve the notes page
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Get all notes from db.json
app.get('/api/notes', (req, res) => {
  const data = require(dbPath);
  res.json(data);
});

// Create a new note and save to db.json
app.post('/api/notes', (req, res) => {
  const incomingData = req.body;
  const data = require(dbPath);
  incomingData.id = uniqid();
  data.push(incomingData);
  saveData(data);
  res.json(incomingData);
});

// Delete a note with the given ID from db.json
app.delete('/api/notes/:id', (req, res) => {
  const data = require(dbPath);
  const noteIndex = data.findIndex(note => note.id === req.params.id);
  if (noteIndex !== -1) {
    data.splice(noteIndex, 1);
    saveData(data);
    res.send('Note deleted.');
  } else {
    res.status(404).send('Note not found to delete.');
  }
});

// Serve the home page for any other unused route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

// Start the server
app.listen(PORT, err => {
  if (err) {
    console.log(err);
  } else {
    console.log('Listening at port: ' + PORT);
  }
});