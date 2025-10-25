const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const searchBox = document.getElementById("search-box");
const clearBtn = document.getElementById("clear-all");

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Render all tasks
function renderTasks() {
    listContainer.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.innerText = task.text;
        if(task.checked) li.classList.add("checked");

        // Edit
        taskText.ondblclick = function() {
            const newText = prompt("Edit task:", task.text);
            if(newText && newText.trim() !== "") {
                tasks[index].text = newText;
                saveAndRender();
            }
        }

        // Priority
        const priority = document.createElement("select");
        ["High 🔴","Medium 🟡","Low 🟢"].forEach(p => {
            const option = document.createElement("option");
            option.value = p;
            option.innerText = p;
            if(task.priority === p) option.selected = true;
            priority.appendChild(option);
        });
        priority.onchange = function() {
            tasks[index].priority = priority.value;
            saveAndRender();
        }
        // Due date
        const dueDate = document.createElement("input");
        dueDate.type = "date";

        // Set min date to today
        const today = new Date().toISOString().split("T")[0];
        dueDate.min = today;

        if(task.dueDate) dueDate.value = task.dueDate;
        dueDate.onchange = function() {
            tasks[index].dueDate = dueDate.value;
            saveAndRender();
        }


        // Delete
        const del = document.createElement("span");
        del.innerHTML = "\u00d7";
        del.onclick = function() {
            tasks.splice(index,1);
            saveAndRender();
        }

        // Toggle checked
        li.addEventListener("click", function(e) {
            if(e.target === li || e.target === taskText) {
                li.classList.toggle("checked");
                tasks[index].checked = li.classList.contains("checked");
                saveAndRender();
            }
        });

        li.appendChild(taskText);
        li.appendChild(priority);
        li.appendChild(dueDate);
        li.appendChild(del);
        listContainer.appendChild(li);
    });
}

// Add a new task
function addTask() {
    const text = inputBox.value.trim();
    if(!text) return alert("You must write something!");
    tasks.push({text, checked:false, priority:"Medium 🟡", dueDate:""});
    inputBox.value = "";
    saveAndRender();
}

// Save to localStorage and render
function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

// Search/filter
searchBox.addEventListener("input", function() {
    const filter = searchBox.value.toLowerCase();
    Array.from(listContainer.children).forEach((li, i) => {
        const text = tasks[i].text.toLowerCase();
        li.style.display = text.includes(filter) ? "" : "none";
    });
});

// Clear all
clearBtn.addEventListener("click", function() {
    if(confirm("Are you sure you want to clear all tasks?")) {
        tasks = [];
        saveAndRender();
    }
});

// Initial render
renderTasks();
