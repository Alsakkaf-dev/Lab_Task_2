let tasks = [];
let nextId = 1;

const modal = document.getElementById("taskModal");
const priorityFilter = document.getElementById("priorityFilter");
const totalBadge = document.getElementById("totalBadge");
const clearDoneBtn = document.getElementById("clearDoneBtn");

function createTaskCard(taskObj) {
  const li = document.createElement("li");
  li.classList.add("task-card", taskObj.priority);
  li.setAttribute("data-id", taskObj.id);

  const title = document.createElement("h3");
  title.textContent = taskObj.title;
  title.addEventListener("dblclick", () => inlineEdit(title, taskObj.id));

  const desc = document.createElement("p");
  desc.textContent = taskObj.description;

  const meta = document.createElement("div");
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

priorityFilter.addEventListener("change", (e) => {
  const val = e.target.value;
  document.querySelectorAll(".task-card").forEach((card) => {
    const isMatch = val === "all" || card.classList.contains(val);
    card.classList.toggle("is-hidden", !isMatch);
  });
});
