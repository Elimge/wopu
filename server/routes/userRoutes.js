/**
 * File: server/routes/userRoutes.js
 * Description: Defines API routes for user management, accessible only by admins.
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const userController = require('../controllers/userController');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
// The request first goes through authMiddleware, then adminMiddleware, and finally to the controller.
router.get('/', [authMiddleware, adminMiddleware], userController.getAllUsers);

module.exports = router;