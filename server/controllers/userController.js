/**
 * File: server/controllers/userController.js
 * Description: Controller for user management actions (e.g., for admins).
 */
const User = require('../models/userModel');

const userController = {
    /**
     * Retrieves a list of all users.
     * Intended for admin use.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async getAllUsers(req, res) {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({ message: 'Server error while retrieving users.' });
        }
    }
};

module.exports = userController;