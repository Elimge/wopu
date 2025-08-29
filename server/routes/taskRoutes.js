/**
 * File: server/routes/taskRoutes.js
 * Description: Defines the API routes for task-related actions.
 * All routes in this file are protected by the authentication middleware.
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const taskController = require('../controllers/taskController');

// Apply the authentication middleware to ALL routes defined in this file.
// This means a user must be logged in (i.e., provide a valid token)
// to access any of these endpoints.
router.use(authMiddleware);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for the logged-in user
 * @access  Private
 */
router.get('/', taskController.getAllTasks);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', taskController.createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update a specific task
 * @access  Private
 */
router.put('/:id', taskController.updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a specific task
 * @access  Private
 */
router.delete('/:id', taskController.deleteTask);

module.exports = router;