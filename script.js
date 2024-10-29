function loadTodos() {
  const todos = JSON.parse(localStorage.getItem("todos")) || { todoList: [] };
  return todos;
}

function refreshTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function addTodoToLocalStorage(todo) {
  const todos = loadTodos();
  todos.todoList.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodo(todo) {
  const todoList = document.getElementById("todoList");
  const divli = document.createElement("div");

  const li = document.createElement("li");
  li.className = "todo-item";
  li.setAttribute("data-id", todo.id);

  if (todo.done) {
    divli.className = "done";
  }

  const divfilter = document.createElement("div");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", deleteBtnListener);

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-btn";
  editBtn.addEventListener("click", editBtnListener);

  const doneBtn = document.createElement("button");
  doneBtn.textContent = todo.done ? "Reset" : "Done";
  doneBtn.className = "done-btn";
  doneBtn.addEventListener("click", completeBtnListener);

  divfilter.appendChild(deleteBtn);
  divfilter.appendChild(editBtn);
  divfilter.appendChild(doneBtn);

  divli.textContent = todo.todoValue;
  li.appendChild(divli);
  li.appendChild(divfilter);

  todoList.appendChild(li);
}

function executeFilterListener(event) {
  const filter = event.target.getAttribute("data-filter");
  const ul = document.getElementById("todoList");
  const todos = loadTodos();
  ul.innerHTML = "";

  if (filter === "all") {
    todos.todoList.forEach((todo) => {
      renderTodo(todo);
    });
  } else if (filter === "done") {
    todos.todoList.forEach((todo) => {
      if (todo.done) {
        renderTodo(todo);
      }
    });
  } else if (filter === "pending") {
    todos.todoList.forEach((todo) => {
      if (!todo.done) {
        renderTodo(todo);
      }
    });
  }
}

function resetHTMLrender(todos) {
  const ul = document.getElementById("todoList");
  ul.innerHTML = "";
  todos.todoList.forEach((todo) => {
    renderTodo(todo);
  });
}

function completeBtnListener(event) {
  console.log("completeBtnListener");
  const todo = event.target.parentElement.parentElement;
  const todoId = todo.getAttribute("data-id");
  const todos = loadTodos();

  todos.todoList.forEach((todo) => {
    if (todo.id === parseInt(todoId)) {
      todo.done = !todo.done;
    }
  });

  refreshTodos(todos);

  resetHTMLrender(todos);
}

function deleteBtnListener(event) {
  console.log("deleteBtnListener");
  const todo = event.target.parentElement.parentElement;
  const todoId = todo.getAttribute("data-id");
  const todos = loadTodos();

  todos.todoList = todos.todoList.filter(
    (todo) => todo.id !== parseInt(todoId)
  );
  console.log(todos.todoList);
  refreshTodos(todos);

  resetHTMLrender(todos);
}

function editBtnListener(event) {
  const todo = event.target.parentElement.parentElement;
  const todoId = todo.getAttribute("data-id");
  const todos = loadTodos();

  const response = prompt("Enter new todo");
  todos.todoList.forEach((todo) => {
    if (todo.id === parseInt(todoId)) {
      todo.todoValue = response;
    }
  });

  refreshTodos(todos);

  resetHTMLrender(todos);
}

function addTodoBtnListener() {
  const todoValue = todoInput.value;
  if (todoValue === "") {
    alert("Please enter a todo");
    return;
  }

  todos = loadTodos();
  const lenOfTodos = todos.todoList.length;

  // Add todo to localStorage and render it on the page and clear the input
  addTodoToLocalStorage({
    todoValue: todoValue,
    done: false,
    id: lenOfTodos + 1,
  });

  renderTodo({ todoValue: todoValue, done: false, id: lenOfTodos + 1 });

  todoInput.value = "";
}
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM is ready");

  const todoInput = document.getElementById("todoInput");
  const addTodoBtn = document.getElementById("addTodoBtn");
  const filterBtns = document.getElementsByClassName("filterBtns");

  // Load todos from localStorage
  let todos = loadTodos();

  // Event listeners for todoInput
  todoInput.addEventListener("change", function (event) {
    const todoValue = event.target.value;
    event.target.value = todoValue.trim();
  });

  // Event listeners for todoBtn
  addTodoBtn.addEventListener("click", addTodoBtnListener);

  // Render todos from localStorage
  todos.todoList.forEach((todo) => {
    renderTodo(todo);
  });

  // Event listeners for filterBtns
  for (const btn of filterBtns) {
    btn.addEventListener("click", executeFilterListener);
  }

  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTodoBtnListener();
    }
  });
});
