const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
// const routes = require('./routes');

const PORT = process.env.PORT || 3001;

// set up express app to handle dataparsing
app.use(express.json());
app.use(express.static(path.join(__dirname, "./public")));


// serves home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

// serves note taking page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});



// creates the bridge to api and serves the db.json when api/notes is entered in url
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

// sends note list data the notes.html page with the provided note list data and serves the db.json
app.post('/api/notes', (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let note = req.body;
    savedNotes[note.id] = note;
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
});

// deletes the selected note, searching via ID
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let noteID = req.params.id;
    console.log(typeof noteID);
    console.log('deleting note# ' + noteID);
    let newID = 0;
    // Deleting note based on ID
    savedNotes.splice(noteID, 1);
  
    // resetting note IDs by order
    for (note of savedNotes) {
      note.id = newID.toString();
      newID++;
    }
    
    fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  })
  
// Catches all to send to home page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.listen(PORT, () => console.log(`Server is listening to PORT ${PORT}`));
// app.listen('port', process.env.PORT || 3001);