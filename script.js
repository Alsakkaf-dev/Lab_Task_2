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

function renderNotes() {
    // Safely clear using while loop (Lab Constraint)
    while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.firstChild);
    }

    if (notes.length === 0) {
        const msg = document.createElement("div");
        msg.textContent = "✨ No notes yet. Create one!";
        msg.style.cssText = "color:#94a3b8; text-align:center; padding:1rem;";
        notesContainer.appendChild(msg);
        updateCounter();
        return;
    }

    notes.forEach(note => {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note-item");

        const titleRow = document.createElement("div");
        titleRow.classList.add("note-title");
        
        const titleSpan = document.createElement("span");
        titleSpan.textContent = note.title;

        const btnGrp = document.createElement("div");

        // Bonus: Edit Button
        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️ Edit";
        editBtn.classList.add("edit-note");
        editBtn.setAttribute("data-action", "edit");
        editBtn.setAttribute("data-id", note.id);

        // Delete Button
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️ Delete";
        delBtn.classList.add("delete-note");
        delBtn.setAttribute("data-action", "delete");
        delBtn.setAttribute("data-id", note.id);

        btnGrp.append(editBtn, delBtn);
        titleRow.append(titleSpan, btnGrp);

        const contentP = document.createElement("p");
        contentP.classList.add("note-content");
        contentP.textContent = note.content || "(no additional content)";

        noteDiv.append(titleRow, contentP);
        notesContainer.appendChild(noteDiv);
    });
    updateCounter();
}

function addNote() {
    const title = titleInput.value.trim();
    if (title === "") {
        alert("❌ Title cannot be empty!"); // BOM Alert
        titleInput.focus();
        return;
    }
    notes.push({ id: nextId++, title, content: contentInput.value.trim() });
    renderNotes();
    titleInput.value = ""; contentInput.value = "";
    titleInput.focus();
}

function deleteNoteById(id) {
    if (confirm("⚠️ Delete this note?")) { // BOM Confirm
        notes = notes.filter(n => n.id !== id);
        renderNotes();
    }
}

function clearAll() {
    if (notes.length === 0) return alert("Nothing to clear.");
    if (confirm(`❗ Delete all ${notes.length} notes?`)) {
        notes = []; nextId = 1;
        renderNotes();
        alert("✨ Cleared.");
    }
}

function updateWindowSize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    let cat = w < 480 ? "📱 Mobile" : (w < 1024 ? "📑 Tablet" : "💻 Desktop");
    windowSizeSpan.textContent = `${w} x ${h} px (${cat})`;
}

function showUserAgent() {
    let agent = navigator.userAgent;
    userAgentSpan.textContent = agent.length > 55 ? agent.slice(0, 52) + "..." : agent;
}

