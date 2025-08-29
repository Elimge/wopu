// app/views/tasks.js

// Importamos TODAS las funciones que necesitamos del servicio de tareas
import { getAllTasks, createTask, updateTask, deleteTask } from '../../app/services/taskService.js';

// --- ELEMENTOS DEL DOM Y VARIABLES ---
// (Definimos todo lo que necesitamos al principio)

const quadrantMap = {
    iu: 'tasks-iu',
    inu: 'tasks-inu',
    niu: 'tasks-niu',
    ninu: 'tasks-ninu'
};

const taskMatrix = document.getElementById('task-matrix');
const taskModal = document.getElementById('task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const taskIdInput = document.getElementById('task-id');
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

let taskToDeleteId = null; // Para manejar la confirmación de borrado

// --- FUNCIONES DE RENDERIZADO (UI) ---
// (Estas funciones solo se preocupan de "pintar" la interfaz)

function renderTasks(tasks) {
    Object.values(quadrantMap).forEach(quadrantId => {
        const quadrant = document.getElementById(quadrantId);
        if (quadrant) quadrant.innerHTML = '';
    });

    tasks.forEach(task => {
        const quadrantId = quadrantMap[task.category];
        const taskQuadrant = document.getElementById(quadrantId);
        if (taskQuadrant) {
            const taskCard = document.createElement('div');
            taskCard.className = `task-card status-${task.status}`;
            taskCard.dataset.taskId = task.id;
            taskCard.innerHTML = `
                <div class="task-details">
                    <p>${task.title}</p>
                    ${createTaskStatusSelector(task)}
                </div>
                <div class="task-actions">
                    <button class="btn-icon btn-edit">✏️</button>
                    <button class="btn-icon btn-delete">🗑️</button>
                </div>
            `;
            taskQuadrant.appendChild(taskCard);
        }
    });
}

function createTaskStatusSelector(task) {
    const statuses = { 'todo': 'To Do', 'progress': 'In Progress', 'completed': 'Completed' };
    let options = '';
    for (const [value, text] of Object.entries(statuses)) {
        const isSelected = value === task.status ? 'selected' : '';
        options += `<option value="${value}" ${isSelected}>${text}</option>`;
    }
    return `<select class="task-status-selector" data-task-id="${task.id}">${options}</select>`;
}

// --- LÓGICA DE DATOS ---
// (Esta función habla con el servicio y dispara el renderizado)

async function fetchAndRenderTasks() {
    try {
        const tasks = await getAllTasks();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        // Aquí podríamos mostrar un mensaje de error en la UI
    }
}

// --- FUNCIONES DE MODALES (UI) ---

function openModalForCreate() {
    taskForm.reset();
    taskIdInput.value = '';
    modalTitle.textContent = 'Add New Task';
    taskModal.style.display = 'block';
}

async function openModalForEdit(taskId) {
    try {
        const tasks = await getAllTasks(); // Obtenemos el estado actual
        const taskToEdit = tasks.find(t => t.id == taskId);
        if (taskToEdit) {
            taskForm.reset();
            modalTitle.textContent = 'Edit Task';
            taskIdInput.value = taskToEdit.id;
            document.getElementById('task-title').value = taskToEdit.title;
            const { category } = taskToEdit;
            document.getElementById('important-yes').checked = (category === 'iu' || category === 'inu');
            document.getElementById('important-no').checked = (category === 'niu' || category === 'ninu');
            document.getElementById('urgent-yes').checked = (category === 'iu' || category === 'niu');
            document.getElementById('urgent-no').checked = (category === 'inu' || category === 'ninu');
            taskModal.style.display = 'block';
        }
    } catch (error) {
        console.error("Error preparing edit modal:", error);
    }
}

function closeModal() { taskModal.style.display = 'none'; }
function openDeleteModal(taskId) { taskToDeleteId = taskId; deleteConfirmModal.style.display = 'block'; }
function closeDeleteModal() { taskToDeleteId = null; deleteConfirmModal.style.display = 'none'; }


// --- EVENT LISTENERS ---

// Listener para el formulario (Crear y Editar)
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = document.getElementById('task-title').value;
    const isImportant = document.querySelector('input[name="importance"]:checked').value === 'true';
    const isUrgent = document.querySelector('input[name="urgency"]:checked').value === 'true';
    let category = '';
    if (isImportant && isUrgent) category = 'iu';
    else if (isImportant && !isUrgent) category = 'inu';
    else if (!isImportant && isUrgent) category = 'niu';
    else category = 'ninu';
    
    const taskId = taskIdInput.value;
    const taskData = { title, category };

    try {
        if (taskId) {
            // No necesitamos el estado (status) aquí, ya que se maneja por separado
            await updateTask(taskId, taskData);
        } else {
            // Al crear, el estado por defecto será 'todo'
            await createTask({ ...taskData, status: 'todo' });
        }
        await fetchAndRenderTasks();
        closeModal();
    } catch (error) {
        console.error("Error saving task:", error);
        alert("Could not save the task.");
    }
});

// Listener para la matriz de tareas (Delegación para Editar, Eliminar y Cambiar Estado)
taskMatrix.addEventListener('click', (event) => {
    const target = event.target;
    const taskCard = target.closest('.task-card');
    if (!taskCard) return;

    const taskId = Number(taskCard.dataset.taskId);
    
    if (target.matches('.btn-edit')) {
        openModalForEdit(taskId);
    } else if (target.matches('.btn-delete')) {
        openDeleteModal(taskId);
    }
});

taskMatrix.addEventListener('change', async (event) => {
    const target = event.target;
    if (target.matches('.task-status-selector')) {
        const taskId = Number(target.dataset.taskId);
        const newStatus = target.value;
        try {
            await updateTask(taskId, { status: newStatus });
            await fetchAndRenderTasks();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }
});

// Listeners para los modales
addTaskBtn.addEventListener('click', openModalForCreate);
closeModalBtn.addEventListener('click', closeModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

confirmDeleteBtn.addEventListener('click', async () => {
    if (taskToDeleteId) {
        try {
            await deleteTask(taskToDeleteId);
            await fetchAndRenderTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            closeDeleteModal();
        }
    }
});

taskModal.addEventListener('click', (event) => { if (event.target === taskModal) closeModal(); });
deleteConfirmModal.addEventListener('click', (event) => { if (event.target === deleteConfirmModal) closeDeleteModal(); });


// --- CARGA INICIAL ---
fetchAndRenderTasks();