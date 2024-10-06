document.getElementById("addObjective").addEventListener("click", addObjective);

let objectives = [];

// Cargar datos desde data.json
function loadObjectives() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            objectives = data.objectives;
            renderObjectives();
        })
        .catch(error => console.error('Error al cargar JSON:', error));
}

function saveObjectives() {
    localStorage.setItem("objectives", JSON.stringify(objectives));
}

function renderObjectives() {
    const container = document.getElementById("objectivesContainer");
    container.innerHTML = "";

    objectives.forEach((objective, objectiveIndex) => {
        const objectiveDiv = document.createElement("div");
        objectiveDiv.className = "objective";
        objectiveDiv.innerHTML = `<h3>${objective.text}</h3>`;
        
        const taskInput = document.createElement("input");
        taskInput.placeholder = "Agregar tarea...";
        const prioritySelect = document.createElement("select");
        prioritySelect.innerHTML = `
            <option value="">Prioridad</option>
            <option value="urgent">Urgente</option>
            <option value="medium">Medio</option>
            <option value="low">Bajo</option>
        `;
        const addTaskButton = document.createElement("button");
        addTaskButton.innerText = "Agregar Tarea";
        
        addTaskButton.addEventListener("click", () => {
            const taskText = taskInput.value.trim();
            const priority = prioritySelect.value;

            if (taskText && priority) {
                const task = { text: taskText, completed: false, priority, timeSpent: 0 };
                objectives[objectiveIndex].tasks.push(task);
                taskInput.value = "";
                saveObjectives();
                renderObjectives();
            }
        });

        objectiveDiv.appendChild(taskInput);
        objectiveDiv.appendChild(prioritySelect);
        objectiveDiv.appendChild(addTaskButton);
        
        const taskList = document.createElement("div");
        
        objective.tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement("div");
            taskDiv.className = `task ${task.priority}`;
            taskDiv.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="complete">✔</button>
                <button class="delete">❌</button>
            `;
            
            taskDiv.querySelector(".complete").addEventListener("click", () => {
                const timeTaken = prompt("¿Cuánto tiempo tomaste para completar esta tarea en minutos?");
                if (timeTaken) {
                    task.completed = true;
                    task.timeSpent = parseInt(timeTaken, 10);
                    alert(`Tiempo registrado: ${timeTaken} minutos`);
                    saveObjectives();
                    renderObjectives();
                }
            });

            taskDiv.querySelector(".delete").addEventListener("click", () => {
                objectives[objectiveIndex].tasks.splice(taskIndex, 1);
                saveObjectives();
                renderObjectives();
            });

            taskList.appendChild(taskDiv);
        });
        
        objectiveDiv.appendChild(taskList);
        
        // Botón de resumen para cada objetivo
        const summaryButton = document.createElement("button");
        summaryButton.innerText = "Mostrar Resumen";
        summaryButton.addEventListener("click", () => {
            showSummary(objective);
        });
        
        objectiveDiv.appendChild(summaryButton);
        container.appendChild(objectiveDiv);
    });

    displayMotivationalMessage();
}

function showSummary(objective) {
    const completedTasks = _.filter(objective.tasks, { completed: true });
    const pendingTasks = _.filter(objective.tasks, { completed: false });
    const totalTimeSpent = _.sumBy(completedTasks, 'timeSpent');
    
    const summary = `
        Objetivo: ${objective.text}
        Tareas Completadas: ${completedTasks.length}
        Tareas Pendientes: ${pendingTasks.length}
        Tiempo Total Invertido: ${totalTimeSpent} minutos
    `;
    
    alert(summary.trim() || "No hay tareas para este objetivo.");
}

function addObjective() {
    const objectiveInput = document.getElementById("objectiveInput");
    const objectiveText = objectiveInput.value.trim();

    if (objectiveText) {
        const newObjective = { text: objectiveText, tasks: [] };
        objectives.push(newObjective);
        objectiveInput.value = "";
        saveObjectives();
        renderObjectives();
    }
}

function displayMotivationalMessage() {
    const allCompleted = objectives.every(obj => obj.tasks.every(task => task.completed));
    const messageElement = document.getElementById("motivationalMessage");

    if (allCompleted) {
        messageElement.innerText = "¡Gran trabajo! Has completado todas tus tareas.";
        messageElement.style.display = "block";
    } else {
        messageElement.style.display = "none";
    }
}

// Cargar objetivos al iniciar
loadObjectives();
