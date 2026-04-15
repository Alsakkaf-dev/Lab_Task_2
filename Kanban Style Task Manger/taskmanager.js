// --- 1. STATE MANAGEMENT ---
let tasks = [];
let nextId = 1;
let currentFilter = 'all';

// --- 2. DOM REFERENCES ---
const modal = document.getElementById("taskModal");
const priorityFilter = document.getElementById("priorityFilter");
const totalBadge = document.getElementById("totalBadge");
const clearDoneBtn = document.getElementById("clearDoneBtn");

// --- 3. CORE CRUD FUNCTIONS (Task 2) ---
// This function builds the visual card for each task using data
function createTaskCard(taskObj) {
  const li = document.createElement('li');
  li.className = `task-card ${taskObj.priority}`; 
  li.setAttribute('data-id', taskObj.id);
  li.setAttribute('draggable', 'true');

  
  const contentWrap = document.createElement('div');
  contentWrap.style.marginBottom = "12px";

  const title = document.createElement('h3');
  title.textContent = taskObj.title;
  title.style.fontSize = "1.1rem";
  title.addEventListener('dblclick', () => inlineEdit(title, taskObj.id));

  const desc = document.createElement('p');
  desc.textContent = taskObj.description || "—";
  desc.style.color = "#64748b";
  desc.style.fontSize = "0.85rem";

  const date = document.createElement('span');
  date.innerHTML = `⏳ ${taskObj.dueDate || 'No date'}`;
  date.style.cssText = "font-size: 0.7rem; font-weight: 700; color: #94a3b8; text-transform: uppercase;";

  
  const actionBar = document.createElement('div');
  actionBar.style.cssText = "display: flex; justify-content: flex-end; gap: 5px; margin-top: 15px;";

  const editBtn = document.createElement('button');
  editBtn.textContent = "Edit";
  editBtn.setAttribute('data-action', 'edit');
  editBtn.setAttribute('data-id', taskObj.id);
  editBtn.className = "btn-small";

  const delBtn = document.createElement('button');
  delBtn.textContent = "Delete";
  delBtn.setAttribute('data-action', 'delete');
  delBtn.setAttribute('data-id', taskObj.id);
  delBtn.className = "btn-small delete-style";

  
  li.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', taskObj.id);
    li.classList.add('dragging');
  });
  li.addEventListener('dragend', () => li.classList.remove('dragging'));

  contentWrap.append(title, desc);
  actionBar.append(editBtn, delBtn);
  li.append(contentWrap, date, actionBar);

  return li;
}


// Put the new task in the list and show it in the column
function addTask(columnId, taskObj) {
  tasks.push(taskObj);
  const card = createTaskCard(taskObj);
  if (currentFilter !== "all" && taskObj.priority !== currentFilter) {
    card.classList.add("is-hidden");
  }
  document.querySelector(`#${columnId} .task-list`).appendChild(card);
  updateTaskCounter();
}

// Remove the task from the screen and the list
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

// Change the number at the top to match how many tasks exist
function updateTaskCounter() {
  totalBadge.textContent = `${tasks.length} Tasks`;
}

document.querySelectorAll(".task-list").forEach((list) => {
  list.addEventListener("click", (e) => {
    const action = e.target.getAttribute("data-action");
    const id = parseInt(e.target.getAttribute("data-id"));
    if (action === "delete") deleteTask(id);
    if (action === "edit") openModal(false, id);
  });
});

// Let the user change the title by typing directly on the card
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

// Show or hide tasks based on the priority filter choice
priorityFilter.addEventListener("change", (e) => {
  currentFilter = e.target.value; 
  const val = currentFilter;
  document.querySelectorAll(".task-card").forEach((card) => {
    const isMatch = val === "all" || card.classList.contains(val);
    card.classList.toggle("is-hidden", !isMatch);
  });
});


// Open the popup window to either add a new task or edit an old one
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


// This runs when you click the save button to finish adding or editing
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
    
    const t = tasks.find((x) => x.id === parseInt(id));
    Object.assign(t, data);
    const oldCard = document.querySelector(`li[data-id="${id}"]`);
    oldCard.replaceWith(createTaskCard(t));
    if (currentFilter !== "all" && t.priority !== currentFilter) {
      newCard.classList.add("is-hidden");
    }
  } else {

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
