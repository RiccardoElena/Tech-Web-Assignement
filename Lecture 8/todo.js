const LocalStorageAccess = (() => {
  const todos = [];

  const addTodo = (todo) => {
    if (!todo) return;

    todos.push(todo);

    localStorage.todos = JSON.stringify(todos);
  };

  const getTodos = () => {
    return [...todos];
  };

  const loadInitialTodos = () => {
    const todosJSON = localStorage.todos;

    if (!todosJSON) return;
    const parsedTodos = JSON.parse(todosJSON);
    parsedTodos.forEach((todo) => todos.push(todo));
  };

  const updateTodo = (todo) => {
    const todoIndex = todos.findIndex((el) => el.id === parseInt(todo.id));

    if (todoIndex === -1) return;
    todos[todoIndex] = todo;

    localStorage.todos = JSON.stringify(todos);
  };

  const deleteTodo = (id) => {
    const index = todos.findIndex((todo) => todo.id === parseInt(id));

    if (index === -1) return;

    todos.splice(index, 1);

    localStorage.todos = JSON.stringify(todos);
  };
  return {
    addTodo,
    getTodos,
    loadInitialTodos,
    updateTodo,
    deleteTodo,
  };
})();

class TodosRenderer {
  constructor(listId) {
    this.list = document.getElementById(listId);
  }

  renderAllTodos() {
    const todos = LocalStorageAccess.getTodos();
    todos.forEach((todo) => this.renderTodo(todo));
  }

  renderTodo(todo) {
    const { value, done, id } = todo;
    const newTodo = document.createElement('li');
    newTodo.textContent = value;
    newTodo.id = id;
    this.addEventListenersToTodo(newTodo);
    if (done) newTodo.classList.add('done');
    this.list.appendChild(newTodo);
  }

  addEventListenersToTodo(todo) {
    todo.addEventListener('click', function () {
      todo.classList.toggle('done');
      LocalStorageAccess.updateTodo(
        new Todo(this.textContent, this.classList.contains('done'), this.id)
      );
    });
    const list = this.list;
    todo.addEventListener('dblclick', function () {
      LocalStorageAccess.deleteTodo(this.id);
      list.removeChild(this);
    });
  }
}

class Todo {
  constructor(text, done = false, id = Math.floor(Math.random() * 100000)) {
    this.value = text;
    this.done = done;
    this.id = parseInt(id);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const addButton = document.getElementById('todo-add-button');
  LocalStorageAccess.loadInitialTodos();
  const renderer = new TodosRenderer('todo-list');
  renderer.renderAllTodos();
  const input = document.getElementById('todo-input');

  const addNRender = (value) => {
    const val = value.trim();
    if (!val) return;
    const todo = new Todo(val);
    LocalStorageAccess.addTodo(todo);
    renderer.renderTodo(todo);
  };

  addButton.addEventListener('click', function () {
    addNRender(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addNRender(this.value);
      this.value = '';
    }
  });
});
