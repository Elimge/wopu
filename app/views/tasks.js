
/**
 * File: app/views/tasks.js
 * Description: Handles the UI and logic for the Tasks page, including rendering, modals, and event listeners.
 */

// Import all required functions from the task service
import { getAllTasks, createTask, updateTask, deleteTask } from '../../app/services/taskService.js';

// --- DOM ELEMENTS AND VARIABLES ---

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

let taskToDeleteId = null; // Used for delete confirmation

// --- RENDERING FUNCTIONS (UI) ---

/**
 * Renders all tasks into their respective quadrants in the UI.
 * @param {Array} tasks - Array of task objects to render
 */
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

/**
 * Creates the HTML for the status selector dropdown for a task.
 * @param {Object} task - The task object
 * @returns {string} HTML string for the status selector
 */
function createTaskStatusSelector(task) {
    const statuses = { 'todo': 'To Do', 'progress': 'In Progress', 'completed': 'Completed' };
    let options = '';
    for (const [value, text] of Object.entries(statuses)) {
        const isSelected = value === task.status ? 'selected' : '';
        options += `<option value="${value}" ${isSelected}>${text}</option>`;
    }
    return `<select class="task-status-selector" data-task-id="${task.id}">${options}</select>`;
}

// --- DATA LOGIC ---

/**
 * Fetches all tasks and renders them in the UI.
 * Handles errors if fetching fails.
 */
async function fetchAndRenderTasks() {
    try {
        const tasks = await getAllTasks();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    // Optionally show an error message in the UI
    }
}

// --- MODAL FUNCTIONS (UI) ---

/**
 * Opens the modal for creating a new task and resets the form.
 */
function openModalForCreate() {
    taskForm.reset();
    taskIdInput.value = '';
    modalTitle.textContent = 'Add New Task';
    taskModal.style.display = 'block';
}

/**
 * Opens the modal for editing an existing task and populates the form.
 * @param {number} taskId - The ID of the task to edit
 */
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

/**
 * Closes the task modal.
 */
function closeModal() { taskModal.style.display = 'none'; }
/**
 * Opens the delete confirmation modal for a specific task.
 * @param {number} taskId - The ID of the task to delete
 */
function openDeleteModal(taskId) { taskToDeleteId = taskId; deleteConfirmModal.style.display = 'block'; }
/**
 * Closes the delete confirmation modal.
 */
function closeDeleteModal() { taskToDeleteId = null; deleteConfirmModal.style.display = 'none'; }


// --- EVENT LISTENERS ---

// Listener for the form (Create and Edit)
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
            await updateTask(taskId, taskData);
        } else {
            await createTask({ ...taskData, status: 'todo' });
        }
        await fetchAndRenderTasks();
        closeModal();
    } catch (error) {
        console.error("Error saving task:", error);
        alert("Could not save the task.");
    }
});

// Listener for the task matrix (delegation for Edit, Delete, and Status Change)
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

// Listeners for modals
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


// --- INITIAL LOAD ---
fetchAndRenderTasks();