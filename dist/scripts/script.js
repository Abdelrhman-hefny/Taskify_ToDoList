"use strict";
const documentObj = document;
const taskInput = documentObj.getElementById("taskInput");
const addTaskButton = documentObj.getElementById("addTask");
const taskList = documentObj.getElementById("taskList");
const clearAllButton = documentObj.getElementById("clearAllTasks");
const searchInput = documentObj.querySelector("#searchTask input");
// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let editingTaskIndex = null;
// Show tasks on the page
function renderTasks() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const taskCard = document.createElement("div");
        taskCard.classList.add("col-12", "mb-3");
        taskCard.dataset.index = index.toString(); // Store task index
        taskCard.innerHTML = `
            <div class="card h-100">
                <div class="card-body d-flex justify-content-between align-items-center">
                    <div class="task-item-content d-flex align-items-center gap-2">
                        <i class="fa-regular fa-square check"></i>
                        <p class="card-text mb-0">${task}</p>
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
            tasks[editingTaskIndex] = newTask;
            editingTaskIndex = null;
            updateButtonText();
        }
        else {
            tasks.push(newTask);
        }
        taskInput.value = "";
        localStorage.setItem("tasks", JSON.stringify(tasks));
        renderTasks();
        searchInput && filterTasks(searchInput.value.toLowerCase());
    }
});
// Handle clicks on tasks (check, edit, delete)
taskList.addEventListener("click", (event) => {
    var _a, _b, _c, _d;
    const clickedElement = event.target;
    const taskCard = clickedElement.closest(".col-12");
    if (!taskCard)
        return;
    const taskIndex = parseInt(taskCard.dataset.index || "0");
    if (clickedElement.classList.contains("check")) {
        (_b = (_a = clickedElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.classList.toggle("completed");
    }
    else if (clickedElement.classList.contains("editTask")) {
        taskInput.value = ((_c = taskCard.querySelector("p")) === null || _c === void 0 ? void 0 : _c.textContent) || "";
        editingTaskIndex = taskIndex;
        updateButtonText();
        taskInput.focus();
    }
    else if (clickedElement.classList.contains("btnDelete")) {
        const taskCard = clickedElement.closest(".col-12");
        const taskText = ((_d = taskCard.querySelector("p")) === null || _d === void 0 ? void 0 : _d.textContent) || "";
        taskCard.style.animation = "fadeOut 0.3s ease-out";
        setTimeout(() => {
            tasks.splice(taskIndex, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderTasks();
            searchInput && filterTasks(searchInput.value.toLowerCase());
        }, 200);
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
    taskElements.forEach((taskElement, index) => {
        var _a;
        const taskText = ((_a = tasks[index]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || "";
        taskElement.style.display = taskText.includes(searchText) ? "" : "none";
    });
}
// Live search
searchInput === null || searchInput === void 0 ? void 0 : searchInput.addEventListener("input", () => {
    filterTasks(searchInput.value.toLowerCase());
});
// Load tasks on page start
renderTasks();
// Dark mode toggle
const darkModeToggle = documentObj.getElementById("darkModeToggle");
const lightModeToggle = documentObj.getElementById("lightModeToggle");
// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
    documentObj.body.classList.add("dark-mode");
    darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.classList.add("d-none");
    lightModeToggle === null || lightModeToggle === void 0 ? void 0 : lightModeToggle.classList.remove("d-none");
}
if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
        documentObj.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
        darkModeToggle.classList.add("d-none");
        lightModeToggle === null || lightModeToggle === void 0 ? void 0 : lightModeToggle.classList.remove("d-none");
    });
}
if (lightModeToggle) {
    lightModeToggle.addEventListener("click", () => {
        documentObj.body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
        lightModeToggle.classList.add("d-none");
        darkModeToggle === null || darkModeToggle === void 0 ? void 0 : darkModeToggle.classList.remove("d-none");
    });
}

//# sourceMappingURL=script.js.map
