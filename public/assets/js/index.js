let noteTitle;
let noteBody;
let save;
let newNote;
let noteList;
let notes;

if (window.location.pathname === '/notes') {
  noteTitle = $('.note-title');
  noteBody = $('.note-textarea');
  save = $('.save-note');
  newNote = $('.new-note');
  noteList = $('.list-container .list-group');
}

/**
 * 
 * WHEN I enter a new note title and the note’s text
 * THEN a Save icon appears in the navigation at the top of the page
WHEN I click on the Save icon
THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
WHEN I click on an existing note in the list in the left-hand column
THEN that note appears in the right-hand column
WHEN I click on the Write icon in the navigation at the top of the page
THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column 
*/

// activeNote is used to keep track of the note in the textarea
let activeNote = {};
var currentID;

// api call to retrieve json data on note list from db.json
const getNotes = () => {
  return fetch('/api/notes', {
    method: 'GET',
  })
    .then(data => data.json())
    .then(data => populateNoteList(data))
};

// api call to append new note to list of notes, or update existing note
const saveNote = () => {
  activeNote.title = noteTitle.val();
  activeNote.body = noteBody.val();
  let note = { 'title': noteTitle.val(), 'body': noteBody.val(), 'id': currentID };
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note)
  })
    .then(init());
};

// api call to delete the specified note form the db.json
const deleteNote = (id) => {
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  init();
};

// updates list column with the notes in db.json
const populateNoteList = function(storedNotes) {
  notes = storedNotes;
  noteList.empty();
  for (note of storedNotes) {
    noteList.append(
      $('<div>').addClass('list-group-item').css('display', 'flex').css('justify-content', 'space-between').append(
        $('<p>').text(note.title).addClass('list-item-title').data('body', note.body).data('id', note.id)).append(
          $('<i>').addClass('fas fa-trash-alt float-right text-danger delete-note').data('id', note.id)
        )
    );
  }
};

// checks to make sure neither the title or body text input fields are empty before allowing user to save teh note
const maybeShowSave = () => {
  activeNote.id = currentID.toString();
  if (!noteTitle.val().trim() || !noteBody.val().trim()) {
    save.hide();
  } else {
    save.show();
  }
};

// populates text fields with the selected note info, updates the currentID
const renderNote = (data) => {
  // stores selected note info
  activeNote = { title: data.children(0).text(), body: data.children(0).data('body'), id: data.children(0).data('id') };
  // only resets active note if a new note is clicked. 
  // clicking the same note twice does not refresh the active note field because it would delete any unsaved edits made
  if (currentID != activeNote.id) {
    currentID = activeNote.id;
    noteTitle.val(activeNote.title);
    noteBody.val(activeNote.body);
  };
};

// handles rendering a blank template to write notes. Hides the save icon so that empty notes cant be saved to the db
// and empties the text entry fields. creates a new id for the new note.
const startNewNote = function () {
  save.hide();
  activeNote = [];
  noteTitle.val('');
  noteBody.val('');
  currentID = notes.length.toString();
};

// on page load:
// render existing db.json notes to note column
function init() {
  getNotes().then(function (data) { startNewNote(); });
};

// creates new note, empties the activeNote variable and text fields and assigns an ID
newNote.on('click', startNewNote);

// onclick event handler to display the note data clicked 
noteList.on('click', '.list-group-item', function () {
  let data = $(this); // couldn't figure out how to pass $(this) directly into the callback....
  renderNote(data);
});
noteList.on('click', '.delete-note', function () {
  let id = $(this).data('id');
  deleteNote(id);
});

// toggles save button visibility
noteTitle.on('keyup', maybeShowSave);
noteBody.on('keyup', maybeShowSave);

save.on('click', saveNote);


init();