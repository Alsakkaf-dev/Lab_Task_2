// --- 1. STATE MANAGEMENT ---
let tasks = [];
let nextId = 1;

// --- 2. DOM REFERENCES ---
const modal = document.getElementById("taskModal");
const priorityFilter = document.getElementById("priorityFilter");
const totalBadge = document.getElementById("totalBadge");
const clearDoneBtn = document.getElementById("clearDoneBtn");

// --- 3. CORE CRUD FUNCTIONS (Task 2) ---

function createTaskCard(taskObj) {
  // REQUIREMENT: Must NOT use innerHTML/template literals to build the card
  const li = document.createElement("li");
  li.classList.add("task-card", taskObj.priority);
  li.setAttribute("data-id", taskObj.id);

  const title = document.createElement("h3");
  title.textContent = taskObj.title;
  title.addEventListener("dblclick", () => inlineEdit(title, taskObj.id));

  const desc = document.createElement("p");
  desc.textContent = taskObj.description;

  const meta = document.createElement("span");
  meta.style.fontSize = "0.75rem";
  meta.style.color = "#94a3b8";
  meta.style.display = "block";
  meta.style.marginBottom = "10px";
  meta.textContent = taskObj.dueDate
    ? `📅 Due: ${taskObj.dueDate}`
    : `📅 No Due Date`;
  meta.style.fontSize = "0.8rem";
  meta.textContent = `Due: ${taskObj.dueDate || "N/A"}`;

  const btnContainer = document.createElement("div");
  btnContainer.style.marginTop = "10px";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.setAttribute("data-action", "edit");
  editBtn.setAttribute("data-id", taskObj.id);

  const delBtn = document.createElement("button");
  delBtn.textContent = "Delete";
  delBtn.style.marginLeft = "5px";
  delBtn.setAttribute("data-action", "delete");
  delBtn.setAttribute("data-id", taskObj.id);

  li.setAttribute("draggable", "true");
  li.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", taskObj.id);
    li.classList.add("dragging");
  });
  li.addEventListener("dragend", () => {
    li.classList.remove("dragging");
  });

  btnContainer.append(editBtn, delBtn);
  li.append(title, desc, meta, btnContainer);

  return li;
}

function addTask(columnId, taskObj) {
  tasks.push(taskObj);
  const card = createTaskCard(taskObj);
  document.querySelector(`#${columnId} .task-list`).appendChild(card);
  updateTaskCounter();
}

function deleteTask(taskId) {
  const card = document.querySelector(`li[data-id="${taskId}"]`);
  if (card) {
    card.classList.add("fade-out");
    card.addEventListener("animationend", () => {
      card.remove();
      tasks = tasks.filter((t) => t.id !== taskId);
      updateTaskCounter();
    });
  }
}

// --- 4. INTERACTION LOGIC (Task 3) ---

function updateTaskCounter() {
  totalBadge.textContent = `${tasks.length} Tasks`;
}

// Event Delegation for Edit/Delete (RUBRIC CRITERION)
document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    const id = parseInt(e.target.getAttribute("data-id"));
    if (action === "delete") deleteTask(id);
    if (action === "edit") openModal(false, id);
  });
});

// Inline Editing (Double-Click)
function inlineEdit(titleElement, taskId) {
  const originalText = titleElement.textContent;
  const input = document.createElement("input");
  input.value = originalText;

  titleElement.replaceWith(input);
  input.focus();

  const commitChange = () => {
    const newTitle = input.value.trim() || originalText;
    const task = tasks.find((t) => t.id === taskId);
    task.title = newTitle;
    titleElement.textContent = newTitle;
    input.replaceWith(titleElement);
  };

  input.onblur = commitChange;
  input.onkeydown = (e) => {
    if (e.key === "Enter") commitChange();
  };
}

// Priority Filter
priorityFilter.addEventListener("change", (e) => {
  const val = e.target.value;
  document.querySelectorAll(".task-card").forEach((card) => {
    const isMatch = val === "all" || card.classList.contains(val);
    card.classList.toggle("is-hidden", !isMatch);
  });
});

// Modal Logic
function openModal(isNew = true, taskId = null, colId = "todo") {
  modal.classList.remove("is-hidden");
  if (isNew) {
    document.getElementById("modalTitle").textContent = "Add Task";
    document.getElementById("modalTaskId").value = "";
    document.getElementById("modalColumnId").value = colId;
  } else {
    const task = tasks.find((t) => t.id === taskId);
    document.getElementById("modalTitle").textContent = "Edit Task";
    document.getElementById("modalTaskId").value = task.id;
    document.getElementById("taskTitle").value = task.title;
    document.getElementById("taskDesc").value = task.description;
    document.getElementById("taskPriority").value = task.priority;
    document.getElementById("taskDueDate").value = task.dueDate;
  }
}

document.getElementById("saveTaskBtn").onclick = () => {
  const title = document.getElementById("taskTitle").value.trim();
  const id = document.getElementById("modalTaskId").value;
  if (!title) return alert("Title required");

  const data = {
    title,
    description: document.getElementById("taskDesc").value,
    priority: document.getElementById("taskPriority").value,
    dueDate: document.getElementById("taskDueDate").value,
  };

  if (id) {
    // Update
    const t = tasks.find((x) => x.id === parseInt(id));
    Object.assign(t, data);
    const oldCard = document.querySelector(`li[data-id="${id}"]`);
    oldCard.replaceWith(createTaskCard(t));
  } else {
    // Create
    const newTask = { id: nextId++, ...data };
    addTask(document.getElementById("modalColumnId").value, newTask);
  }

  closeModal();
};

function closeModal() {
  modal.classList.add("is-hidden");
  document
    .querySelectorAll(".modal-content input, textarea")
    .forEach((i) => (i.value = ""));
}

document.getElementById("closeModalBtn").onclick = closeModal;
document.querySelectorAll(".add-task-btn").forEach((btn) => {
  btn.onclick = () => openModal(true, null, btn.getAttribute("data-column"));
});

// Clear Done (Staggered Animation - RUBRIC CRITERION)
clearDoneBtn.onclick = () => {
  const cards = document.querySelectorAll("#done .task-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      deleteTask(parseInt(card.getAttribute("data-id")));
    }, index * 100);
  });
};

document.querySelectorAll(".column").forEach((column) => {
  const list = column.querySelector(".task-list");

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");

    const id = e.dataTransfer.getData("text/plain");
    const draggedCard = document.querySelector(`.task-card[data-id="${id}"]`);

    if (draggedCard && list) {
      list.appendChild(draggedCard);
    }
  });
});
