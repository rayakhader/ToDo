let allTasks = [];
let currentPageNumber = 1;

document.addEventListener('DOMContentLoaded', async () => {
    await loadTasks();
    renderPagination();
    displayPage(currentPageNumber);
    renderTaskCount();
  });
  
  async function loadTasks() {
    const response = await fetch('https://dummyjson.com/todos');
    const { todos } = await response.json();
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || todos;
    allTasks = storedTasks;
    if (!localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(storedTasks));
    }
  }

  async function createTask() {
    const input = document.getElementById('task');
    const taskText = input.value.trim();
    if (!taskText) return alert('Please enter a task');
    
    const newTask = {
      id: allTasks.length + 1,
      todo: taskText,
      userId: 1,
      completed: false
    };
  
    await fetch('https://dummyjson.com/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
  
    allTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    input.value = '';
    renderPagination();
    renderTaskCount();
    displayPage();
  }

  function displayPage(pageNum = 1) {
    currentPageNumber = pageNum;
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const pageButtons = document.querySelectorAll('ul li');
  
    if (!pageButtons.length) {
      document.querySelector('tbody').innerHTML = `<tr><td colspan="5">No Tasks Found</td></tr>`;
      return;
    }
  
    pageButtons.forEach(li => li.classList.remove('selected'));
    [...pageButtons].find(li => li.textContent == pageNum)?.classList.add('selected');
  
    const totalPages = Math.ceil(tasks.length / itemsPerPage);
    document.getElementById('pre-arrow').disabled = pageNum === 1;
    document.getElementById('next-arrow').disabled = pageNum === totalPages;
  
    const start = (pageNum - 1) * itemsPerPage;
    const currentTasks = tasks.slice(start, start + itemsPerPage);
    
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';
    currentTasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${task.id}</td>
        <td>${task.todo}</td>
        <td>${task.userId}</td>
        <td><span class="badge ${task.completed ? 'badge-complete' : 'badge-pend'}">${task.completed ? 'Completed' : 'Pending'}</span></td>
        <td class="actions-lg">
          <button class="btn btn-delete" onclick="removeTask(${task.id})"><i class="fas fa-trash"></i></button>
          <button class="btn btn-done" ${task.completed ? 'disabled' : ''} onclick="markTaskAsDone(${task.id})"><i class="fas fa-check"></i></button>
        </td>
        <td class="actions-sm">
          <select onchange="handleDropdownAction(event, ${task.id})">
            <option value="">Select</option>
            <option value="delete">Delete</option>
            <option value="done" ${task.completed ? 'disabled' : ''}>Done</option>
          </select>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  async function removeTask(id) {
    allTasks = allTasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    await fetch(`https://dummyjson.com/todos/${id}`, { method: 'DELETE' });
    await loadTasks();
    renderPagination();
    renderTaskCount();
    displayPage(currentPageNumber);
  }
  
  async function markTaskAsDone(id) {
    const tasks = allTasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    );
    allTasks = tasks;
    localStorage.setItem('tasks', JSON.stringify(allTasks));
    await loadTasks();
    displayPage(currentPageNumber);
  }

  function searchTasks() {
    const searchValue = document.getElementById('search')?.value?.toLowerCase();
    if (!searchValue) {
      localStorage.setItem('tasks', JSON.stringify(allTasks));
    } else {
      const filtered = allTasks.filter(task =>
        task.todo.toLowerCase().includes(searchValue)
      );
      localStorage.setItem('tasks', JSON.stringify(filtered));
    }
    renderPagination();
    renderTaskCount();
    displayPage();
  }