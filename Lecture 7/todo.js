const removeTodo = (todo) => {
  const todoList = document.querySelector('#todo-list');
  todoList.removeChild(todo);
};
const toggleTodo = (todo) => {
  todo.classList.toggle('done');
};

const addEventListenersToTodo = (todo) => {
  todo.addEventListener('click', function () {
    toggleTodo(todo);
  });
  todo.addEventListener('dblclick', function () {
    removeTodo(todo);
  });
};

const createTodo = (todoText) => {
  const newTodo = document.createElement('li');
  newTodo.textContent = todoText;
  addEventListenersToTodo(newTodo);
  return newTodo;
};

const addTodoToList = (todoText) => {
  const todoList = document.querySelector('#todo-list');
  const newTodo = createTodo(todoText);
  todoList.appendChild(newTodo);
};

const addTodo = (todoText) => {
  todoText = todoText.trim();
  if (todoText) {
    addTodoToList(todoText);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.querySelector('#todo-add-button');
  const input = document.querySelector('#todo-input');
  addButton.addEventListener('click', function () {
    addTodo(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo(this.value);
      this.value = '';
    }
  });
});
