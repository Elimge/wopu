/**
 * File: app/services/taskService.js
 * Description: Provides CRUD operations for user tasks by communicating with the backend API.
 */

// API base URL for task-related endpoints
const API_URL = 'https://wopu-api.onrender.com/api/tasks';

/**
 * A helper function to create authorization headers.
 * @returns {Headers} A Headers object with the Authorization token.
 */
function _getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
}

/**
 * A helper function to map backend data (is_important, is_urgent)
 * to the category string ('iu', 'inu', etc.) that the frontend UI expects.
 * @param {object} task - A task object from the backend.
 * @returns {object} The task object with an added 'category' property.
 */
function _mapTaskDataForFrontend(task) {
    let category = '';
    if (task.is_important && task.is_urgent) category = 'iu';
    else if (task.is_important && !task.is_urgent) category = 'inu';
    else if (!task.is_important && task.is_urgent) category = 'niu';
    else category = 'ninu';
    
    // The database uses snake_case, but our frontend might expect camelCase. Let's return a consistent object.
    return {
        id: task.id,
        title: task.title,
        category: category, // The crucial property for the UI
        status: task.status,
        is_important: task.is_important, // Keep original data too
        is_urgent: task.is_urgent
    };
}


/**
 * Retrieves all user tasks from the backend.
 * @returns {Promise<Array>} Array of task objects.
 */
async function getAllTasks() {
    console.log("TaskService: Fetching all tasks from API");
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: _getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks.');
    }
    const tasksFromApi = await response.json();
    // Map the data to the format the frontend needs
    return tasksFromApi.map(_mapTaskDataForFrontend);
}

/**
 * Creates a new task via the backend API.
 * @param {Object} taskData - Data for the new task.
 * @returns {Promise<Object>} The created task object.
 */
async function createTask(taskData) {
    console.log("TaskService: Creating new task via API", taskData);
    
    // The frontend form in tasks.js sends 'isImportant' and 'isUrgent' booleans.
    // The backend `createTask` controller expects exactly this format. Perfect match.
    
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create task.');
    }
    return response.json();
}

/**
 * Updates an existing task via the backend API.
 * @param {number} taskId - ID of the task to update.
 * @param {Object} taskData - Updated task data.
 * @returns {Promise<Object>} The updated task object.
 */
async function updateTask(taskId, taskData) {
    console.log(`TaskService: Updating task ${taskId} via API`, taskData);
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'PUT',
        headers: _getAuthHeaders(),
        body: JSON.stringify(taskData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update task.');
    }
    return response.json();
}

/**
 * Deletes a task via the backend API.
 * @param {number} taskId - ID of the task to delete.
 * @returns {Promise<Object>} Success status.
 */
async function deleteTask(taskId) {
    console.log(`TaskService: Deleting task ${taskId} via API`);
    const response = await fetch(`${API_URL}/${taskId}`, {
        method: 'DELETE',
        headers: _getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete task.');
    }
    return response.json();
}

// Export CRUD functions for use in other modules
export { getAllTasks, createTask, updateTask, deleteTask };
