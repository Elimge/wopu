/**
 * File: server/controllers/taskController.js
 * Description: This controller handles the business logic for task management.
 * It uses the taskModel to interact with the database.
 */
const Task = require('../models/taskModel');

const taskController = {
    /**
     * Creates a new task for the authenticated user.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async createTask(req, res) {
        try {
            const { title, isImportant, isUrgent } = req.body;
            const userId = req.user.id; // Get user ID from the token payload (via authMiddleware)

            if (!title) {
                return res.status(400).json({ message: 'Title is required.' });
            }

            const result = await Task.create({
                userId,
                title,
                isImportant: !!isImportant, // Coerce to boolean
                isUrgent: !!isUrgent      // Coerce to boolean
            });

            const newTask = await Task.findById(result.insertId);
            res.status(201).json(newTask); // Respond with the newly created task object

        } catch (error) {
            console.error('Create task error:', error);
            res.status(500).json({ message: 'Server error during task creation.' });
        }
    },

    /**
     * Retrieves all tasks for the authenticated user.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async getAllTasks(req, res) {
        try {
            const userId = req.user.id;
            const tasks = await Task.findAllByUserId(userId);
            res.json(tasks);
        } catch (error) {
            console.error('Get all tasks error:', error);
            res.status(500).json({ message: 'Server error while retrieving tasks.' });
        }
    },

    /**
     * Updates an existing task.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;

            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(444).json({ message: 'Task not found.' });
            }
            if (task.user_id !== userId) {
                return res.status(403).json({ message: 'User not authorized to update this task.' });
            }

            const updatedData = {
                title: req.body.title !== undefined ? req.body.title : task.title,
                isImportant: req.body.isImportant !== undefined ? req.body.isImportant : task.is_important,
                isUrgent: req.body.isUrgent !== undefined ? req.body.isUrgent : task.is_urgent,
                status: req.body.status !== undefined ? req.body.status : task.status,
            };

            await Task.update(taskId, updatedData);

            const newlyUpdatedTask = await Task.findById(taskId);
            res.json(newlyUpdatedTask);

        } catch (error) {
            console.error('Update task error:', error);
            res.status(500).json({ message: 'Server error while updating task.' });
        }
    },

    /**
     * Deletes a task.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            const userId = req.user.id;

            // Security Check: Verify the task exists and belongs to the user before deleting
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: 'Task not found.' });
            }
            if (task.user_id !== userId) {
                return res.status(403).json({ message: 'User not authorized to delete this task.' });
            }

            await Task.deleteById(taskId);
            res.json({ message: 'Task deleted successfully.' });

        } catch (error) {
            console.error('Delete task error:', error);
            res.status(500).json({ message: 'Server error while deleting task.' });
        }
    }
};

module.exports = taskController;