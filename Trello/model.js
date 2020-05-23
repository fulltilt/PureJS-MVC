function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function Model() {
  this.containers = [new Containers(1, "fasf"), new Containers(0, "")];

  this.addContainer = function (title) {
    let id = Math.floor(getRandomInt(1, 1000));
    this.containers.push(new Containers(id, title));
    const lastElIndex = this.containers.length - 1;
    [this.containers[lastElIndex], this.containers[lastElIndex - 1]] = [
      this.containers[lastElIndex - 1],
      this.containers[lastElIndex],
    ];
  };

  this.removeContainer = function (id) {
    this.containers = this.containers.filter(
      (container) => container.id !== parseInt(id, 10)
    );
  };

  this.shiftContainers = function (from, to) {
    let t = [this.containers[from]];

    if (from < to) {
      // shift elements left
      let left = this.containers.slice(0, from);
      let mid = this.containers.slice(from + 1, to + 1);
      let right = this.containers.slice(to + 1);

      this.containers = left.concat(mid).concat(t).concat(right);
    } else {
      // shift elements right
      let left = this.containers.slice(0, to);
      let mid = this.containers.slice(to, from);
      let right = this.containers.slice(from + 1);

      this.containers = left.concat(t).concat(mid).concat(right);
    }
  };

  this.addTask = function (text, container) {
    let containerToAddTo = this.containers.filter(
      (c) => c.id === container.id
    )[0];
    let id = Math.floor(getRandomInt(1, 1000));
    containerToAddTo.tasks.push(new Task(id, text));
  };
}

function Containers(id, title) {
  this.id = id;
  this.title = title;
  this.tasks = [];

  this.addTask = function (taskText) {
    const task = new Task(
      this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].id + 1 : 1,
      taskText
    );

    this.tasks.push(task);

    // this._commit(this.tasks);
  };

  // Map through all tasks, and replace the text of the task with the specified id
  this.editTask = function (id, updatedText) {
    this.tasks = this.tasks.map(
      (task) => (task.id === id ? { ...task, text: updatedText } : task) // text: updatedText must come last else it will be overwritten
    );

    // this._commit(this.tasks);
  };

  this.deleteTask = function (id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);

    // this._commit(this.tasks);
  };

  this.toggleTask = function (id) {
    this.tasks = this.tasks.map((task) =>
      task.id === id ? { ...task, complete: !task.complete } : task
    );

    // this._commit(this.tasks);
  };
}

function Task(id, text) {
  this.id = id;
  this.text = text;
}
