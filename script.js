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