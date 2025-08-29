
/**
 * File: server/routes/profileRoutes.js
 * 
 * Defines the routes for profile-related actions.
 * These routes are protected by the authentication middleware.
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

// Apply the authentication middleware to all routes in this file
router.use(authMiddleware);

/**
 * @route   GET /api/profile
 * @desc    Get current user's profile
 * @access  Private
 */
router.get('/', profileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user's profile
 * @access  Private
 */
router.put('/', profileController.updateProfile);

module.exports = router;
