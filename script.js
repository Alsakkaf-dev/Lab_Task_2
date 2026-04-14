let notes = []; 
let nextId = 1;

const notesContainer = document.getElementById("notesContainer");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const addBtn = document.getElementById("addNoteBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const noteCounterSpan = document.getElementById("noteCounter");
const windowSizeSpan = document.getElementById("windowSize");
const userAgentSpan = document.getElementById("userAgent");


function updateCounter() {
    const count = notes.length;
    noteCounterSpan.textContent = count === 1 ? "1 note" : `${count} notes`;
}