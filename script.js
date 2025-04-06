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