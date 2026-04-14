let tasks = [];
let nextId = 1;

const modal = document.getElementById('taskModal');
const priorityFilter = document.getElementById('priorityFilter');
const totalBadge = document.getElementById('totalBadge');
const clearDoneBtn = document.getElementById('clearDoneBtn');

function createTaskCard(taskObj) {
    const li = document.createElement('li');
    li.classList.add('task-card', taskObj.priority);
    li.setAttribute('data-id', taskObj.id);

    const title = document.createElement('h3');
    title.textContent = taskObj.title;
    title.addEventListener('dblclick', () => inlineEdit(title, taskObj.id));

    const desc = document.createElement('p');
    desc.textContent = taskObj.description;

    const meta = document.createElement('div');
    meta.style.fontSize = "0.8rem";
    meta.textContent = `Due: ${taskObj.dueDate || 'N/A'}`;

    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = "10px";

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.setAttribute('data-action', 'edit');
    editBtn.setAttribute('data-id', taskObj.id);

    const delBtn = document.createElement('button');
    delBtn.textContent = "Delete";
    delBtn.style.marginLeft = "5px";
    delBtn.setAttribute('data-action', 'delete');
    delBtn.setAttribute('data-id', taskObj.id);

    btnContainer.append(editBtn, delBtn);
    li.append(title, desc, meta, btnContainer);
    
    return li;
}

