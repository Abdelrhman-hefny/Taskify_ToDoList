"use strict";
const documentObj = document;
const taskInput = documentObj.getElementById("taskInput");
const addTaskButton = documentObj.getElementById("addTask");
const taskList = documentObj.getElementById("taskList");
const clearAllButton = documentObj.getElementById("clearAllTasks");
const searchInput = documentObj.querySelector("#searchTask input");
const darkModeToggle = documentObj.getElementById("darkModeToggle");
const lightModeToggle = documentObj.getElementById("lightModeToggle");
// Load tasks from localStorage with validation
let tasks = [];
const storedTasks = localStorage.getItem("tasks");
if (storedTasks) {
    const parsedTasks = JSON.parse(storedTasks);
    // Convert strings or invalid data to Task objects
    tasks = parsedTasks.map((item) => {
        if (typeof item === "string") {
            return { text: item, isComplete: false };
        }
        return { text: item.text || "", isComplete: !!item.isComplete };
    });
}
let editingTaskIndex = null;
// Show tasks on the page
function renderTasks() {
    taskList.innerHTML = "";
    if (tasks.length === 0) {
        taskList.innerHTML = '<p class="no-tasks text-center container" role="status">No tasks yet</p>';
        return;
    }
    tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("col-12", "mb-3");
        taskCard.dataset.index = index.toString();
        taskCard.setAttribute("role", "listitem");
        if (task.isComplete) {
            taskCard.classList.add("completed");
        }
        taskCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div class="task-item-content d-flex align-items-center gap-2">
                        <i class="fa-regular ${task.isComplete ? 'fa-square-check' : 'fa-square'} check"></i>
                        <p class="card-text mb-0">${task.text}</p>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <i class="fa-solid fa-pen-to-square text-primary editTask mx-3"></i>
                        <i class="fa-solid fa-trash text-danger btnDelete"></i>
                    </div>
                </div>
            </div>
        `;
        taskList.appendChild(taskCard);
    });
}
// Change button text for add or update
function updateButtonText() {
    if (editingTaskIndex !== null) {
        addTaskButton.textContent = "Update";
        addTaskButton.classList.remove("btn-primary");
        addTaskButton.classList.add("btn-success");
    }
    else {
        addTaskButton.textContent = "Add";
        addTaskButton.classList.remove("btn-success");
        addTaskButton.classList.add("btn-primary");
    }
}
// Add or update a task
addTaskButton.addEventListener("click", () => {
    const newTask = taskInput.value.trim();
    if (newTask) {
        if (editingTaskIndex !== null) {
            tasks[editingTaskIndex].text = newTask;
            editingTaskIndex = null;
            updateButtonText();
        }
        else {
            tasks.unshift({ text: newTask, isComplete: false });
        }
        taskInput.value = "";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        searchInput && filterTasks(searchInput.value.toLowerCase());
    }
});
// Handle clicks on tasks (check, edit, delete)
taskList.addEventListener("click", (event) => {
    const clickedElement = event.target;
    const taskCard = clickedElement.closest(".col-12");
    if (!taskCard)
        return;
    const taskIndex = parseInt(taskCard.dataset.index || "0");
    if (clickedElement.classList.contains("check")) {
        tasks[taskIndex].isComplete = !tasks[taskIndex].isComplete;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        clickedElement.classList.toggle("fa-square");
        clickedElement.classList.toggle("fa-square-check");
        taskCard.classList.toggle("completed");
    }
    else if (clickedElement.classList.contains("editTask")) {
        taskInput.value = tasks[taskIndex].text;
        editingTaskIndex = taskIndex;
        updateButtonText();
        taskInput.focus();
    }
    else if (clickedElement.classList.contains("btnDelete")) {
        const taskText = tasks[taskIndex].text;
        if (confirm(`Are you sure you want to delete the task "${taskText}"?`)) {
            taskCard.style.animation = "fadeOut 0.3s ease-out";
            taskCard.addEventListener("animationend", () => {
                tasks.splice(taskIndex, 1);
                localStorage.setItem("tasks", JSON.stringify(tasks));
                renderTasks();
                searchInput && filterTasks(searchInput.value.toLowerCase());
            }, { once: true });
        }
    }
});
// Clear all tasks
clearAllButton.addEventListener("click", () => {
    if (tasks.length > 0) {
        if (confirm("Are you sure you want to delete all tasks?")) {
            tasks = [];
            editingTaskIndex = null;
            updateButtonText();
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
        }
    }
});
// Filter tasks based on search
function filterTasks(searchText) {
    const taskElements = Array.from(taskList.children);
    let visibleCount = 0;
    taskElements.forEach((taskElement, index) => {
        if (tasks[index]) {
            const taskText = tasks[index].text.toLowerCase();
            taskElement.style.display = taskText.includes(searchText) ? "" : "none";
            if (taskText.includes(searchText))
                visibleCount++;
        }
    });
    if (visibleCount === 0 && searchText) {
        taskList.innerHTML = '<p class="no-tasks text-center container" role="status">No tasks found</p>';
    }
}
// Debounce search input
let searchTimeout;
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterTasks(searchInput.value.toLowerCase());
    }, 300);
});
// Load tasks on page start
renderTasks();
// Dark mode toggle
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    documentObj.body.classList.add("dark-mode");
    darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.classList.add("d-none");
    lightModeToggle === null || lightModeToggle === void 0 ? void 0 : lightModeToggle.classList.remove("d-none");
}
darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.addEventListener("click", () => {
    documentObj.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
    darkModeToggle.classList.add("d-none");
    lightModeToggle === null || lightModeToggle === void 0 ? void 0 : lightModeToggle.classList.remove("d-none");
});
lightModeToggle === null || lightModeToggle === void 0 ? void 0 : lightModeToggle.addEventListener("click", () => {
    documentObj.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
    lightModeToggle.classList.add("d-none");
    darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.classList.remove("d-none");
});

//# sourceMappingURL=script.js.map
