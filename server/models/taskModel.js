/**
 * File: server/models/taskModel.js
 * Description: Handles all database operations for the 'tasks' table.
 */
const db = require('../config/database');

const Task = {
    /**
     * Creates a new task for a specific user.
     * @param {object} taskData - The data for the new task.
     * @param {number} taskData.userId - The ID of the user creating the task.
     * @param {string} taskData.title - The title of the task.
     * @param {boolean} taskData.isImportant - Whether the task is important.
     * @param {boolean} taskData.isUrgent - Whether the task is urgent.
     * @returns {Promise<object>} The result object from the database query.
     */
    async create({ userId, title, isImportant, isUrgent }) {
        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, is_important, is_urgent, status) VALUES (?, ?, ?, ?, ?)',
            [userId, title, isImportant, isUrgent, 'To Do'] 
        );
        return result;
    },

    /**
     * Finds all tasks belonging to a specific user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} An array of task objects.
     */
    async findAllByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows;
    },

    /**
     * Finds a single task by its ID.
     * @param {number} taskId - The ID of the task.
     * @returns {Promise<object|null>} The task object if found, otherwise null.
     */
    async findById(taskId) {
        const [rows] = await db.execute(
            'SELECT * FROM tasks WHERE id = ?',
            [taskId]
        );
        return rows[0];
    },

    /**
     * Updates an existing task.
     * @param {number} taskId - The ID of the task to update.
     * @param {object} taskData - An object containing the data to update.
     * @returns {Promise<object>} The result object from the database query.
     */
    async update(taskId, { title, isImportant, isUrgent, status }) {
        const [result] = await db.execute(
            'UPDATE tasks SET title = ?, is_important = ?, is_urgent = ?, status = ? WHERE id = ?',
            [title, isImportant, isUrgent, status, taskId]
        );
        return result;
    },

    /**
     * Deletes a task by its ID.
     * @param {number} taskId - The ID of the task to delete.
     * @returns {Promise<object>} The result object from the database query.
     */
    async deleteById(taskId) {
        const [result] = await db.execute(
            'DELETE FROM tasks WHERE id = ?',
            [taskId]
        );
        return result;
    }
};

module.exports = Task;