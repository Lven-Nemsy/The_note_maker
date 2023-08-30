const express = require('express');
const fs = require('fs');
const path = require('path');
const {v4: uuid} =  require('uuid')

// Create an instance of Express
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// The application
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', async (req, res) => {
    const notes = await JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(notes);
});

app.post('/api/notes', async (req, res) => {
    const notes = await JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const newNote = {
        id: uuid(),
        title: req.body.title,
        text: req.body.text,
    };
    
    notes.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(notes));
    res.json(newNote);
});

// Delete notes
app.delete('/api/notes/:id', async (req, res) => {
    const notes = await JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const delNotes = notes.filter(note => note.id !== req.params.id);
	res.send("Note deleted");

    fs.writeFileSync("./db/db.json", JSON.stringify(delNotes));
});

// Catch all for URL route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

