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