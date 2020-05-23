"use strict";

function View() {
  this.addContainer = false;

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
      let li = null;
      if (container.id === 0) {
        if (this.addContainer) {
          li = this.createElement("li", "add-container");
          // let form = this.createElement("form");

          let input = this.createElement("input");
          input.type = "text";
          input.placeholder = "List name...";
          input.classList.add("add-input");

          let addButton = this.createElement("button");
          addButton.textContent = " Add";
          addButton.classList.add("add-container-button");
          addButton.addEventListener("click", (e) => {
            if (input.value.length > 0) {
              controller.addContainer(input.value);
              this.addContainer = false;
              this.render();
            }
          });

          let remove = this.createElement("span", "close");
          remove.style.top = "4em";
          remove.textContent = "X";
          remove.addEventListener("click", (e) => {
            this.addContainer = false;
            this.render();
          });

          li.append(input, addButton, remove);
        } else {
          li = this.createElement("li", "new-container");
          li.id = container.id;

          let text = this.createElement("div");
          text.textContent = "Add another list";
          text.classList.add("add-text");

          li.addEventListener("click", (e) => {
            this.addContainer = true;
            this.render();
          });
          li.append(text);
        }
      } else {
        li = this.createElement("li", "task-container");
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

        li.addEventListener(
          "dragend",
          (e) => {
            e.target.classList.remove("over");
            li.style.opacity = "1";
          },
          false
        );

        // The title of the container
        let title = this.createElement("h5");
        title.textContent = container.title;
        li.append(title);

        let remove = this.createElement("span", "close");
        remove.textContent = "X";
        remove.addEventListener("click", (e) =>
          controller.removeContainer(li.id)
        );
        li.append(remove);

        let dragTaskSrcEl = null;

        // add the tasks inside the container
        let tasksUl = this.createElement("ul", "task-list");
        container.tasks.forEach((t) => {
          let task = this.createElement("li", "task");
          task.id = t.id;
          task.draggable = "true";
          task.addEventListener(
            "dragstart",
            (e) => {
              task.style.opacity = "0.4";

              dragTaskSrcEl = task;
            },
            false
          );

          task.addEventListener(
            "dragover",
            (e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            },
            false
          );

          task.addEventListener(
            "dragenter",
            (e) => e.target.classList.add("over"),
            false
          );

          task.addEventListener(
            "dragleave",
            (e) => e.target.classList.remove("over"),
            false
          );

          task.addEventListener(
            "drop",
            (e) => {
              e.stopPropagation();
              e.target.classList.remove("over");
              if (dragTaskSrcEl !== this) {
                // controller.shiftContainers(dragSrcEl.id, e.target.id);
              }
            },
            false
          );

          task.addEventListener(
            "dragend",
            (e) => {
              e.target.classList.remove("over");
              task.style.opacity = "1";
            },
            false
          );

          let text = this.createElement("p");
          text.textContent = t.text;
          text.classList.add("task-text");

          task.append(text);
          tasksUl.append(task);
        });
        li.append(tasksUl);
      }

      if (container.id !== 0) {
        let addButton = this.createElement("div");
        addButton.textContent = " Add another task";
        addButton.classList.add("add-task-button");
        addButton.addEventListener("click", (e) => {
          // temporarily remove the original add button
          let els = document.getElementsByClassName("add-task-button");
          while (els.length > 0) {
            els[0].parentNode.removeChild(els[0]);
          }

          let input = this.createElement("input");
          input.type = "text";
          input.placeholder = "Task name...";
          input.classList.add("add-input");

          let innerAddButton = this.createElement("button");
          innerAddButton.textContent = " Add Task";
          innerAddButton.classList.add("add-container-button");
          innerAddButton.addEventListener("click", (e) => {
            if (input.value.length > 0) {
              controller.addTask(input.value, container);

              this.render();
            }
          });

          li.append(input, innerAddButton);
        });

        li.append(addButton);
      }

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
