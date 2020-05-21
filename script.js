// https://www.taniarascia.com/javascript-mvc-todo-app/

/* MODEL */
function Model() {
  // The state of the model, an array of todo objects, prepopulated with some data
  this.todos = JSON.parse(localStorage.getItem("todos")) || [];

  this.bindTodoListChanged = function (callback) {
    this.onTodoListChanged = callback;
  };

  this._commit = function (todos) {
    this.onTodoListChanged(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  this.addTodo = function (todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      complete: false,
    };

    this.todos.push(todo);

    this._commit(this.todos);
  };

  // Map through all todos, and replace the text of the todo with the specified id
  this.editTodo = function (id, updatedText) {
    this.todos = this.todos.map(
      (todo) => (todo.id === id ? { ...todo, text: updatedText } : todo) // text: updatedText must come last else it will be overwritten
    );

    this._commit(this.todos);
  };

  this.deleteTodo = function (id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);

    this._commit(this.todos);
  };

  this.toggleTodo = function (id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, complete: !todo.complete } : todo
    );

    this._commit(this.todos);
  };
}

/* VIEW */
function View() {
  // create an element with an optional CSS class
  this.createElement = function (tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  };

  this.getElement = function (selector) {
    return document.querySelector(selector);
  };

  // using underscores in the method names to signify that they're private methods
  this._todoText = function () {
    return this.input.value;
  };

  this._resetInput = function () {
    this.input.value = "";
  };

  this.displayTodos = function (todos) {
    // delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    // show default message
    if (todos.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to do! Add a task?";
      this.todoList.append(p);
    } else {
      // Create todo item nodes for each todo in state
      todos.forEach((todo) => {
        const li = this.createElement("li");
        li.id = todo.id;

        // Each todo item will have a checkbox you can toggle
        const checkbox = this.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.complete;

        // The todo item text will be in a contenteditable span
        const span = this.createElement("span");
        span.contentEditable = true;
        span.classList.add("editable");

        // If the todo is complete, it will have a strikethrough
        if (todo.complete) {
          const strike = this.createElement("s");
          strike.textContent = todo.text;
          span.append(strike);
        } else {
          // Otherwise just display the text
          span.textContent = todo.text;
        }

        // The todos will also have a delete button
        const deleteButton = this.createElement("button", "delete");
        deleteButton.textContent = "Delete";
        li.append(checkbox, span, deleteButton);

        // Append nodes to the todo list
        this.todoList.append(li);
      });
    }
  };

  /* We used arrow functions on all the handle events. This allows us to call them from the view using the 
  this context of the controller. If we did not use arrow functions, we would have to manually bind them, 
  like: this.view.bindAddTodo(this.handleAddTodo.bind(this)) */
  this.bindAddTodo = function (handler) {
    this.form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (this._todoText()) {
        handler(this._todoText());
        this._resetInput();
      }
    });
  };

  this.bindDeleteTodo = function (handler) {
    this.todoList.addEventListener("click", (event) => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  };

  this.bindToggleTodo = function (handler) {
    this.todoList.addEventListener("change", (event) => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  };

  // The root element
  this.app = this.getElement("#root");

  // The title of the app
  this.title = this.createElement("h1");
  this.title.textContent = "Todos";

  // The form, with a [type="text"] input, and a submit button
  this.form = this.createElement("form");

  this.input = this.createElement("input");
  this.input.type = "text";
  this.input.placeholder = "Add todo";
  this.input.name = "todo";

  this.submitButton = this.createElement("button");
  this.submitButton.textContent = "Submit";

  // The visual representation of the todo list
  this.todoList = this.createElement("ul", "todo-list");

  // Append the input and submit button to the form
  this.form.append(this.input, this.submitButton);

  // Append the title, form, and todo list to the app
  this.app.append(this.title, this.form, this.todoList);
}

/* CONTROLLER */
function Controller(model, view) {
  this.model = model;
  this.view = view;

  // this is bound to Model
  this.onTodoListChanged = function (todos) {
    view.displayTodos(todos);
  };

  // this is bound to View
  this.handleAddTodo = function (todoText) {
    model.addTodo(todoText);
  };

  // this is bound to View
  this.handleEditTodo = function (id, todoText) {
    model.editTodo(id, todoText);
  };

  // this is bound to View
  this.handleDeleteTodo = function (id) {
    model.deleteTodo(id);
  };

  // this is bound to View
  this.handleToggleTodo = function (id) {
    model.toggleTodo(id);
  };

  // explicit this binding
  this.model.bindTodoListChanged(this.onTodoListChanged);
  this.view.bindAddTodo(this.handleAddTodo);
  this.view.bindDeleteTodo(this.handleDeleteTodo);
  this.view.bindToggleTodo(this.handleToggleTodo);
  // this.view.bindEditTodo(this.handleEditTodo) - didn't implement this

  // display initial todos
  this.onTodoListChanged(this.model.todos);
}

const app = new Controller(new Model(), new View());
// Test with: app.model.addTodo('Take a nap') in console
