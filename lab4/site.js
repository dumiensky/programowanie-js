class Note {
    content;
    pinned;
    constructor() {
        this.id = parseInt(Math.random() * 100000);
        this.createdAt = Date.now();
        this.title = 'Nowa notatka';
        this.colorHtml = "#fdfd96";
    }
}

const KEY = "userNotes";
const container = document.querySelector('.container');
let notes = [];

(function init(){
    displayNotes();
})()

function saveNotes() {
    localStorage.setItem(KEY, JSON.stringify(notes));
}

function search(elem) {
    displayNotes(elem.value);
}

function displayNotes(search) {
    notes = JSON.parse(localStorage.getItem(KEY));

    container.replaceChildren();

    if (!notes)
        return;

    notes.sort((a, b) => ((b.pinned ?? 0) - a.pinned) * 10 || b.createdAt - a.createdAt);

    for(const note of notes) {

        if (search)
        {
            let searchLower = search.toLowerCase();

            if (!note.title.toLowerCase().includes(searchLower) && (!note.content || !note.content.toLowerCase().includes(searchLower)))
                continue;
        }

        let noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.style.backgroundColor = note.colorHtml;

        let notePinned = document.createElement('input');
        notePinned.type = 'checkbox';
        notePinned.checked = note.pinned;
        notePinned.addEventListener('change', e => {
            modifyNote(note.id, note => {
                note.pinned = e.target.checked;
            });
            displayNotes();
        });

        let noteColor = document.createElement('input');
        noteColor.type = 'color';
        noteColor.value = note.colorHtml;
        noteColor.addEventListener('change', e => {
            modifyNote(note.id, note => {
                note.colorHtml = e.target.value;
            });
            displayNotes();
        });

        let noteManagement = document.createElement('div');
        noteManagement.classList.add('management');
        noteManagement.appendChild(notePinned);
        noteManagement.appendChild(noteColor);

        let noteHeader = document.createElement('input');
        noteHeader.classList.add('note-header');
        noteHeader.type = 'text';
        noteHeader.placeholder = 'Tytuł notatki...';
        noteHeader.value = note.title;
        noteHeader.addEventListener('keyup', e => modifyNote(note.id, note => {
            note.title = e.target.value;
        }));

        let noteContent = document.createElement('input');
        noteContent.classList.add('note-content');
        noteContent.type = 'text';
        noteContent.value = note.content ?? '';
        noteContent.placeholder = 'Treść notatki...';
        noteContent.style.backgroundColor = note.colorHtml;
        noteContent.addEventListener('keyup', e => modifyNote(note.id, note => {
            note.content = e.target.value;
        }));

        let noteDelete = document.createElement('button');
        noteDelete.innerText = 'Usuń';
        noteDelete.addEventListener('click', e => {
            modifyNote(note.id, note => {
                const index = notes.indexOf(note);
                if (index > -1) {
                    notes.splice(index, 1);
                }
            });
            displayNotes();
        });

        noteDiv.appendChild(noteManagement);
        noteDiv.appendChild(noteHeader);
        noteDiv.appendChild(noteContent);
        noteDiv.appendChild(noteDelete);
        container.appendChild(noteDiv);
    }
}

function sync() {
    saveNotes();
    displayNotes();
}

function addNewNote() {

    if (!notes)
        notes = [];

    notes.push(new Note());
    sync();
}

function modifyNote(id, modificator) {
    let note = notes.find(n => n.id == id);
    if (note) {
        modificator(note);
        saveNotes();
    }
}