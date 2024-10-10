// Variables globales
let objectives = [];
let taskIdCounter = 0;

// Crear una clase para los objetivos
class Objective {
    constructor(name) {
        this.name = name;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    getSummary() {
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = this.tasks.length - completedTasks;
        const totalTimeSpent = this.tasks.reduce((acc, task) => acc + task.timeSpent, 0);
        return { completedTasks, pendingTasks, totalTimeSpent };
    }
}

// Crear una clase para las tareas
class Task {
    constructor(name, priority) {
        this.name = name;
        this.priority = priority;
        this.completed = false;
        this.startTime = null;
        this.timeSpent = 0;
    }

    start() {
        this.startTime = Date.now();
    }

    confirm() {
        if (this.startTime) {
            this.timeSpent = Math.floor((Date.now() - this.startTime) / 60000); // Convertir a minutos
            this.completed = true;
        }
    }
}

// Función para crear un nuevo objetivo
function createObjective(name) {
    const newObjective = new Objective(name);
    objectives.push(newObjective);
    renderObjectives();
}

// Función para crear una nueva tarea
function createTask(objectiveIndex, taskName, priority) {
    const task = new Task(taskName, priority);
    objectives[objectiveIndex].addTask(task);
    renderObjectives();
}

// Función para iniciar una tarea
function startTask(objectiveIndex, taskIndex) {
    objectives[objectiveIndex].tasks[taskIndex].start();
    renderObjectives();
}

// Función para confirmar una tarea y calcular el tiempo
function confirmTask(objectiveIndex, taskIndex) {
    objectives[objectiveIndex].tasks[taskIndex].confirm();
    renderObjectives();
    Swal.fire('¡Tarea Completada!', `Tiempo invertido: ${objectives[objectiveIndex].tasks[taskIndex].timeSpent} minutos.`, 'success');
}

// Función para eliminar una tarea
function deleteTask(objectiveIndex, taskIndex) {
    objectives[objectiveIndex].tasks.splice(taskIndex, 1);
    renderObjectives();
}

// Función para mostrar el resumen del objetivo
function showSummary(objectiveIndex) {
    const summary = objectives[objectiveIndex].getSummary();
    Swal.fire(
        'Resumen del Objetivo',
        `Tareas completadas: ${summary.completedTasks}\nTareas pendientes: ${summary.pendingTasks}\nTiempo total invertido: ${summary.totalTimeSpent} minutos.`,
        'info'
    );
}

// Renderizar los objetivos y las tareas
function renderObjectives() {
    const objectivesContainer = document.getElementById('objectives-container');
    objectivesContainer.innerHTML = ''; // Limpiar contenido

    objectives.forEach((objective, objectiveIndex) => {
        const objectiveDiv = document.createElement('div');
        objectiveDiv.classList.add('objective');

        // Título del objetivo
        const title = document.createElement('h3');
        title.textContent = objective.name;
        objectiveDiv.appendChild(title);

        // Botón para agregar tareas
        const taskForm = document.createElement('div');
        taskForm.innerHTML = `
            <input type="text" placeholder="Nombre de la tarea" id="task-name-${objectiveIndex}">
            <select id="task-priority-${objectiveIndex}">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
            </select>
            <button onclick="createTask(${objectiveIndex}, document.getElementById('task-name-${objectiveIndex}').value, document.getElementById('task-priority-${objectiveIndex}').value)">Agregar Tarea</button>
        `;
        objectiveDiv.appendChild(taskForm);

        // Lista de tareas
        objective.tasks.forEach((task, taskIndex) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            // Colorear según prioridad
            taskDiv.style.backgroundColor = task.priority === 'Alta' ? 'red' : task.priority === 'Media' ? 'yellow' : 'lightgreen';

            // Información de la tarea
            taskDiv.innerHTML = `
                <span>${task.name} - Prioridad: ${task.priority}</span>
                <button onclick="startTask(${objectiveIndex}, ${taskIndex})">${task.startTime ? 'En progreso...' : 'Iniciar'}</button>
                <button onclick="confirmTask(${objectiveIndex}, ${taskIndex})" ${task.completed ? 'disabled' : ''}>Confirmar</button>
                <button onclick="deleteTask(${objectiveIndex}, ${taskIndex})">Eliminar</button>
                ${task.completed ? `<span>Tiempo invertido: ${task.timeSpent} minutos</span>` : ''}
            `;
            objectiveDiv.appendChild(taskDiv);
        });

        // Botón para mostrar el resumen
        const summaryButton = document.createElement('button');
        summaryButton.textContent = 'Mostrar Resumen';
        summaryButton.onclick = () => showSummary(objectiveIndex);
        objectiveDiv.appendChild(summaryButton);

        objectivesContainer.appendChild(objectiveDiv);
    });
}

// Evento para agregar un nuevo objetivo
document.getElementById('add-objective').addEventListener('click', () => {
    const objectiveName = document.getElementById('objective-name').value;
    if (objectiveName) {
        createObjective(objectiveName);
        document.getElementById('objective-name').value = ''; // Limpiar campo
    }
});
