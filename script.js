const STORAGE_KEY = "todoAppSavedTasks";

// Load tasks when the app starts
document.addEventListener("DOMContentLoaded", loadTasks);

/* Add task */
function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();
    if (text === "") return;

    createTask(text, false);
    saveTasks();
    input.value = "";
}

/* Create task element */
function createTask(text, completed) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = text;
    li.appendChild(span);

    if (completed) li.classList.add("completed");

    li.addEventListener("click", () => {
        li.classList.toggle("completed");
        saveTasks();
    });

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.className = "delete-btn";
    del.addEventListener("click", (event) => {
        event.stopPropagation();
        li.remove();
        saveTasks();
    });

    li.appendChild(del);
    document.getElementById("taskList").appendChild(li);
}

/* Save tasks to localStorage */
function saveTasks() {
    const listItems = document.querySelectorAll("#taskList li");
    const tasks = [];

    listItems.forEach(li => {
        const span = li.querySelector("span");
        tasks.push({
            text: span.textContent,
            completed: li.classList.contains("completed")
        });
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/* Load tasks from localStorage */
function loadTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const tasks = JSON.parse(saved);
    tasks.forEach(task => createTask(task.text, task.completed));
}

/* Register service worker for PWA */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("service-worker.js")
            .then(reg => console.log("Service Worker Registered", reg))
            .catch(err => console.log("Service Worker Failed", err));
    });
}
