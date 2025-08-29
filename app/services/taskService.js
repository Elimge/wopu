/**
 * File: app/services/taskService.js
 * Description: Provides simulated CRUD operations for user tasks using mock data.
 */

// Mock data for tasks. The service is the single source of truth for task data.
let mockTasks = [
    { id: 1, title: 'Prepare presentation for Monday meeting', category: 'iu', status: 'progress' },
    { id: 2, title: 'Plan Q4 marketing strategy', category: 'inu', status: 'todo' },
    // ... (copia el resto de tus tareas aquí)
];

// --- Simulated CRUD functions ---

/**
 * Retrieves all user tasks (simulated).
 * @returns {Promise<Array>} Array of task objects
 */
async function getAllTasks() {
    console.log("TaskService: Fetching all tasks (simulated)");
    return [...mockTasks]; // Return a copy to avoid accidental mutations
}

/**
 * Creates a new task (simulated).
 * @param {Object} taskData - Data for the new task
 * @returns {Promise<Object>} The created task object
 */
async function createTask(taskData) {
    console.log("TaskService: Creating new task (simulated)", taskData);
    const newTask = {
        id: Date.now(), // Backend would generate this
        ...taskData
    };
    mockTasks.push(newTask);
    return newTask;
}

/**
 * Updates an existing task (simulated).
 * @param {number} taskId - ID of the task to update
 * @param {Object} taskData - Updated task data
 * @returns {Promise<Object>} The updated task object
 * @throws {Error} If task is not found
 */
async function updateTask(taskId, taskData) {
    console.log(`TaskService: Updating task ${taskId} (simulated)`, taskData);
    const index = mockTasks.findIndex(t => t.id == taskId);
    if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...taskData };
        return mockTasks[index];
    }
    throw new Error("Task not found");
}

/**
 * Deletes a task (simulated).
 * @param {number} taskId - ID of the task to delete
 * @returns {Promise<Object>} Success status
 */
async function deleteTask(taskId) {
    console.log(`TaskService: Deleting task ${taskId} (simulated)`);
    mockTasks = mockTasks.filter(t => t.id != taskId);
    return { success: true };
}

// Export CRUD functions for use in other modules
export { getAllTasks, createTask, updateTask, deleteTask };