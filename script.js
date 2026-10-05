const noteForm = document.querySelector('#note-form');
const noteInput = document.querySelector('#note-input');
const noteCategory = document.querySelector('#note-category');
const notesList = document.querySelector('#notes-list');
const noteCount = document.querySelector('#note-count');
const errorMessage = document.querySelector('#error-message');
const searchInput = document.querySelector('#search-input');

let notes = JSON.parse(localStorage.getItem('notes')) || [];

function render(notesToDisplay = notes) {
    notesList.innerHTML = '';

    if (notesToDisplay.length === 0) {
        noteCount.textContent = 'You have no notes yet.';
    } else if (notesToDisplay.length === 1) {
        noteCount.textContent = 'You have 1 note.';
    } else {
        noteCount.textContent = `You have ${notesToDisplay.length} notes.`;
    }

    notesToDisplay.forEach((note) => {
        const li = document.createElement('li');
        li.className = `note-card category-${note.category.toLowerCase()}`;

        const textP = document.createElement('p');
        textP.textContent = note.text;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'note-meta';

        const categorySpan = document.createElement('span');
        categorySpan.textContent = `Category: ${note.category}`;

        const dateSpan = document.createElement('span');
        dateSpan.textContent = note.createdAt;

        metaDiv.appendChild(categorySpan);
        metaDiv.appendChild(dateSpan);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));

        li.appendChild(textP);
        li.appendChild(metaDiv);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });
}

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = noteInput.value.trim();

    if (text === '') {
        errorMessage.textContent = 'Please type a note first.';
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = 'Notes must be 200 characters or fewer.';
        return;
    }

    errorMessage.textContent = '';

    const newNote = {
        id: Date.now(),
        text: text,
        category: noteCategory.value,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    render();

    noteInput.value = '';
});

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    render();
}

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );

    if (filteredNotes.length === 0 && notes.length > 0) {
        notesList.innerHTML = '';
        noteCount.textContent = 'No notes match your search.';
        return;
    }

    render(filteredNotes);
});

render();