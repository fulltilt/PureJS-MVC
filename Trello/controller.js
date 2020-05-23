"use strict";
/*
function View() {
  this.init = function () {
    // The root element
    this.app = document.getElementById("root");

    // The visual representation of the containers list
    this.containers = this.createElement("ul");

    // Append the title, form, and todo list to the app
    this.app.append(this.containers);
  };

  this.render = function () {
    const containers = controller.getContainers();

    // delete all previous containers
    const prevContainers = document.querySelector("ul");
    while (prevContainers.firstChild) {
      prevContainers.removeChild(prevContainers.firstChild);
    }

    let dragSrcEl = null;

    // Create contianer nodes for each container in state
    containers.forEach((container) => {
      const li = this.createElement("li", "task-container");
      li.id = container.id;
      li.draggable = "true";
      li.addEventListener(
        "dragstart",
        (e) => {
          li.style.opacity = "0.4";

          dragSrcEl = li;
        },
        false
      );

      li.addEventListener(
        "dragover",
        (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
        },
        false
      );

      li.addEventListener(
        "dragenter",
        (e) => e.target.classList.add("over"),
        false
      );

      li.addEventListener(
        "dragleave",
        (e) => e.target.classList.remove("over"),
        false
      );

      li.addEventListener(
        "drop",
        (e) => {
          e.stopPropagation();
          e.target.classList.remove("over");
          if (dragSrcEl !== this) {
            controller.shiftContainers(dragSrcEl.id, e.target.id);
          }
        },
        false
      );

      this.containers.addEventListener(
        "dragend",
        (e) => {
          e.target.classList.remove("over");
          li.style.opacity = "1";
        },
        false
      );

      // The title of the container
      this.title = this.createElement("h5");
      this.title.textContent = container.title;
      li.append(this.title);

      this.remove = this.createElement("span", "delete-container");
      this.remove.textContent = "X";
      this.remove.addEventListener("click", (e) =>
        controller.removeContainer(li.id)
      );
      li.append(this.remove);

      // Each todo item will have a checkbox you can toggle
      // const checkbox = this.createElement("input");
      // checkbox.type = "checkbox";
      // checkbox.checked = todo.complete;

      // // The todo item text will be in a contenteditable span
      // const span = this.createElement("span");
      // span.contentEditable = true;
      // span.classList.add("editable");

      // If the todo is complete, it will have a strikethrough
      // if (todo.complete) {
      //   const strike = this.createElement("s");
      //   strike.textContent = todo.text;
      //   span.append(strike);
      // } else {
      //   // Otherwise just display the text
      //   span.textContent = todo.text;
      // }

      // The todos will also have a delete button
      // const deleteButton = this.createElement("button", "delete");
      // deleteButton.textContent = "Delete";
      // li.append(checkbox, span, deleteButton);

      // Append nodes to the todo list
      this.containers.append(li);
    });
  };

  // create an element with an optional CSS class
  this.createElement = function (tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);

    return element;
  };
}
*/
function Controller(model, view) {
  this.model = model;
  this.view = view;
  view.init();

  this.init = function () {
    view.render();
  };

  this.addContainer = function (title) {
    this.model.addContainer(title);

    view.render();
  };

  this.getContainers = function () {
    return this.model.containers;
  };

  this.removeContainer = function (id) {
    this.model.removeContainer(id);

    view.render();
  };

  this.shiftContainers = function (from, to) {
    // get array indices of elements
    let fromIndex = null;
    let toIndex = null;
    for (let i = 0; i < this.model.containers.length; ++i) {
      let current = this.model.containers[i];
      if (current.id === parseInt(from, 10)) {
        fromIndex = i;
      }

      if (current.id === parseInt(to, 10)) {
        toIndex = i;
      }

      if (fromIndex && toIndex) break;
    }

    this.model.shiftContainers(fromIndex, toIndex);

    view.render();
  };

  this.addTask = function (title, container) {
    this.model.addTask(title, container);
    view.render();
  };
}

let controller = new Controller(new Model(), new View());
controller.init();
