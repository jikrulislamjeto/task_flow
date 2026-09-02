document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // DOM ELEMENTS
  // =========================

  const form = document.getElementById("task-form");
  const input = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  const searchInput = document.getElementById("search-input");

  const taskCount = document.getElementById("task-count");

  const emptyState = document.getElementById("empty-state");

  const clearCompletedBtn =
    document.getElementById("clear-completed");

  const filterButtons =
    document.querySelectorAll(".filter-btn");


  // =========================
  // TASK DATA
  // =========================

  let tasks =
    JSON.parse(localStorage.getItem("taskflow-tasks")) || [];

  let currentFilter = "all";


  // =========================
  // SAVE TASKS
  // =========================

  function saveTasks() {

    localStorage.setItem(
      "taskflow-tasks",
      JSON.stringify(tasks)
    );

  }


  // =========================
  // ADD TASK
  // =========================

  form.addEventListener("submit", (event) => {

    event.preventDefault();

    const text = input.value.trim();

    if (!text) return;


    const newTask = {

      id: Date.now(),

      text: text,

      completed: false

    };


    tasks.unshift(newTask);

    saveTasks();

    input.value = "";

    renderTasks();

    input.focus();

  });


  // =========================
  // RENDER TASKS
  // =========================

  function renderTasks() {

    const searchTerm =
      searchInput.value.toLowerCase().trim();


    let filteredTasks = tasks.filter((task) => {

      const matchesSearch =
        task.text.toLowerCase().includes(searchTerm);


      let matchesFilter = true;


      if (currentFilter === "active") {

        matchesFilter = !task.completed;

      }


      if (currentFilter === "completed") {

        matchesFilter = task.completed;

      }


      return matchesSearch && matchesFilter;

    });


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

      emptyState.style.display = "block";

    } else {

      emptyState.style.display = "none";

    }


    filteredTasks.forEach((task) => {

      createTaskElement(task);

    });


    updateTaskCount();

  }


  // =========================
  // CREATE TASK ELEMENT
  // =========================

  function createTaskElement(task) {

    const li = document.createElement("li");

    li.className = "task-item";

    li.dataset.id = task.id;


    li.innerHTML = `

      <label class="checkbox-container">

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
        >

        <span class="checkmark"></span>

        <span class="task-text">
          ${escapeHTML(task.text)}
        </span>

      </label>

      <button class="btn btn-delete">
        Delete
      </button>

    `;


    // =========================
    // COMPLETE TASK
    // =========================

    const checkbox =
      li.querySelector("input");


    checkbox.addEventListener("change", () => {

      const taskId = Number(li.dataset.id);

      const selectedTask =
        tasks.find(task => task.id === taskId);


      if (selectedTask) {

        selectedTask.completed =
          checkbox.checked;

        saveTasks();

        renderTasks();

      }

    });


    // =========================
    // DELETE TASK
    // =========================

    const deleteButton =
      li.querySelector(".btn-delete");


    deleteButton.addEventListener("click", () => {

      li.classList.add("removing");


      setTimeout(() => {

        const taskId =
          Number(li.dataset.id);


        tasks = tasks.filter(
          task => task.id !== taskId
        );


        saveTasks();

        renderTasks();

      }, 250);

    });


    taskList.appendChild(li);

  }


  // =========================
  // SEARCH
  // =========================

  searchInput.addEventListener("input", () => {

    renderTasks();

  });


  // =========================
  // FILTER
  // =========================

  filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

      filterButtons.forEach(btn => {

        btn.classList.remove("active");

      });


      button.classList.add("active");


      currentFilter =
        button.dataset.filter;


      renderTasks();

    });

  });


  // =========================
  // CLEAR COMPLETED
  // =========================

  clearCompletedBtn.addEventListener("click", () => {

    const hasCompletedTasks =
      tasks.some(task => task.completed);


    if (!hasCompletedTasks) return;


    tasks =
      tasks.filter(task => !task.completed);


    saveTasks();

    renderTasks();

  });


  // =========================
  // TASK COUNTER
  // =========================

  function updateTaskCount() {

    const activeTasks =
      tasks.filter(task => !task.completed);


    const count = activeTasks.length;


    taskCount.textContent =
      `${count} ${count === 1 ? "task" : "tasks"} left`;

  }


  // =========================
  // SECURITY
  // Prevent HTML injection
  // =========================

  function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

  }


  // =========================
  // INITIAL RENDER
  // =========================

  renderTasks();

});