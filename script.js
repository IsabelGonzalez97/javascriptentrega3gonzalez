// Añadir evento al botón de agregar objetivo
document.getElementById("addObjective").addEventListener("click", addObjective);

// Arreglo para almacenar los objetivos
let objectives = [];

// Cargar datos desde data.json al inicio
function loadObjectives() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            objectives = data.objectives; // Cargar objetivos del JSON
            renderObjectives(); // Renderizar la lista de objetivos
        })
        .catch(error => console.error('Error al cargar JSON:', error)); // Manejar errores
}

// Guardar objetivos en LocalStorage
function saveObjectives() {
    localStorage.setItem("objectives", JSON.stringify(objectives)); // Convertir a JSON
}

// Renderizar los objetivos y tareas en el DOM
function renderObjectives() {
    const container = document.getElementById("objectivesContainer");
    container.innerHTML = ""; // Limpiar el contenedor antes de renderizar

    // Iterar sobre cada objetivo
    objectives.forEach((objective, objectiveIndex) => {
        const objectiveDiv = document.createElement("div");
        objectiveDiv.className = "objective";
        objectiveDiv.innerHTML = `<h3>${objective.text}</h3>`;
        
        // Crear input para agregar tareas y seleccionar prioridad
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
        
        // Evento para agregar tarea
        addTaskButton.addEventListener("click", () => {
            const taskText = taskInput.value.trim();
            const priority = prioritySelect.value;

            if (taskText && priority) {
                const task = { text: taskText, completed: false, priority, timeSpent: 0 };
                objectives[objectiveIndex].tasks.push(task); // Agregar tarea al objetivo
                taskInput.value = ""; // Limpiar el input
                saveObjectives(); // Guardar cambios
                renderObjectives(); // Volver a renderizar
            }
        });

        objectiveDiv.appendChild(taskInput);
        objectiveDiv.appendChild(prioritySelect);
        objectiveDiv.appendChild(addTaskButton);
        
        const taskList = document.createElement("div");
        
        // Renderizar tareas del objetivo
        objective.tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement("div");
            taskDiv.className = `task ${task.priority}`;
            taskDiv.innerHTML = `
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="complete">✔</button>
                <button class="delete">❌</button>
            `;
            
            // Evento para completar tarea
            taskDiv.querySelector(".complete").addEventListener("click", () => {
                const timeTaken = prompt("¿Cuánto tiempo tomaste para completar esta tarea en minutos?");
                if (timeTaken) {
                    task.completed = true; // Marcar tarea como completada
                    task.timeSpent = parseInt(timeTaken, 10); // Registrar tiempo
                    alert(`Tiempo registrado: ${timeTaken} minutos`);
                    saveObjectives(); // Guardar cambios
                    renderObjectives(); // Volver a renderizar
                }
            });

            // Evento para eliminar tarea
            taskDiv.querySelector(".delete").addEventListener("click", () => {
                objectives[objectiveIndex].tasks.splice(taskIndex, 1); // Eliminar tarea
                saveObjectives(); // Guardar cambios
                renderObjectives(); // Volver a renderizar
            });

            taskList.appendChild(taskDiv); // Agregar tarea a la lista
        });
        
        objectiveDiv.appendChild(taskList);
        
        // Botón de resumen para cada objetivo
        const summaryButton = document.createElement("button");
        summaryButton.innerText = "Mostrar Resumen";
        summaryButton.addEventListener("click", () => {
            showSummary(objective); // Mostrar resumen del objetivo
        });
        
        objectiveDiv.appendChild(summaryButton);
        container.appendChild(objectiveDiv); // Agregar objetivo al contenedor
    });

    displayMotivationalMessage(); // Mostrar mensaje motivacional si es necesario
}

// Mostrar resumen de tareas completadas y pendientes
function showSummary(objective) {
    const completedTasks = _.filter(objective.tasks, { completed: true });
    const pendingTasks = _.filter(objective.tasks, { completed: false });
    const totalTimeSpent = _.sumBy(completedTasks, 'timeSpent');

    // Convertir minutos a horas y minutos
    const hours = Math.floor(totalTimeSpent / 60);
    const minutes = totalTimeSpent % 60;
    
    const summary = `
        Objetivo: ${objective.text}
        Tareas Completadas: ${completedTasks.length}
        Tareas Pendientes: ${pendingTasks.length}
        Tiempo Total Invertido: ${hours} horas y ${minutes} minutos
    `;
    
    alert(summary.trim() || "No hay tareas para este objetivo."); // Mostrar resumen
}


// Agregar un nuevo objetivo
function addObjective() {
    const objectiveInput = document.getElementById("objectiveInput");
    const objectiveText = objectiveInput.value.trim();

    if (objectiveText) {
        const newObjective = { text: objectiveText, tasks: [] }; // Crear nuevo objetivo
        objectives.push(newObjective); // Agregar al arreglo de objetivos
        objectiveInput.value = ""; // Limpiar input
        saveObjectives(); // Guardar cambios
        renderObjectives(); // Volver a renderizar
    }
}

// Mostrar mensaje motivacional si se han completado todos los objetivos
function displayMotivationalMessage() {
    // Comprobar si hay tareas en algún objetivo
    const hasTasks = objectives.some(obj => obj.tasks.length > 0);
    // Comprobar si todas las tareas están completadas
    const allCompleted = objectives.every(obj => obj.tasks.every(task => task.completed));

    const messageElement = document.getElementById("motivationalMessage");

    // Solo mostrar mensaje si hay tareas y todas están completadas
    if (hasTasks && allCompleted) {
        messageElement.innerText = "¡Gran trabajo! Has completado todas tus tareas.";
        messageElement.style.display = "block"; // Mostrar mensaje
    } else {
        messageElement.style.display = "none"; // Ocultar mensaje
    }
}

// Cargar objetivos al iniciar
loadObjectives();

