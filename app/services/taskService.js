// app/services/taskService.js

// Importante: Movemos los mock data desde la vista (tasks.js) al servicio.
// El servicio es ahora la única "fuente de verdad" de los datos.
let mockTasks = [
    { id: 1, title: 'Prepare presentation for Monday meeting', category: 'iu', status: 'progress' },
    { id: 2, title: 'Plan Q4 marketing strategy', category: 'inu', status: 'todo' },
    // ... (copia el resto de tus tareas aquí)
];

// --- FUNCIONES CRUD SIMULADAS ---

// Simula la obtención de todas las tareas del usuario
async function getAllTasks() {
    console.log("TaskService: Fetching all tasks (simulated)");
    // Devolvemos una copia para evitar mutaciones accidentales del array original
    return [...mockTasks]; 
}

// Simula la creación de una nueva tarea
async function createTask(taskData) {
    console.log("TaskService: Creating new task (simulated)", taskData);
    const newTask = {
        id: Date.now(), // El backend generaría esto
        ...taskData
    };
    mockTasks.push(newTask);
    return newTask;
}

// Simula la actualización de una tarea existente
async function updateTask(taskId, taskData) {
    console.log(`TaskService: Updating task ${taskId} (simulated)`, taskData);
    const index = mockTasks.findIndex(t => t.id == taskId);
    if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...taskData };
        return mockTasks[index];
    }
    throw new Error("Task not found");
}

// Simula la eliminación de una tarea
async function deleteTask(taskId) {
    console.log(`TaskService: Deleting task ${taskId} (simulated)`);
    mockTasks = mockTasks.filter(t => t.id != taskId);
    return { success: true };
}

// Exportamos las funciones
export { getAllTasks, createTask, updateTask, deleteTask };