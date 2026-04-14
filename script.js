let notes = []; 
let nextId = 1;

// 2. DOM REFERENCES
const notesContainer = document.getElementById("notesContainer");
const titleInput = document.getElementById("noteTitle");
const contentInput = document.getElementById("noteContent");
const addBtn = document.getElementById("addNoteBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const noteCounterSpan = document.getElementById("noteCounter");
const windowSizeSpan = document.getElementById("windowSize");
const userAgentSpan = document.getElementById("userAgent");
