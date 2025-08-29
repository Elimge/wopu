
/**
 * File: server/controllers/profileController.js
 * 
 * This controller contains the logic for managing user profiles.
 * It handles getting the current user's profile and updating it.
 */
const Profile = require('../models/profileModel');

const profileController = {
    /**
     * Gets the profile of the currently authenticated user.
     * @param {object} req - The Express request object, with user attached from auth middleware.
     * @param {object} res - The Express response object.
     */
    async getProfile(req, res) {
        try {
            // The user ID is attached to the request by the authMiddleware
            const profile = await Profile.findByUserId(req.user.id);
            if (!profile) {
                return res.status(404).json({ message: 'Profile not found.' });
            }
            res.json(profile);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Server error while retrieving profile.' });
        }
    },

    /**
     * Updates the profile of the currently authenticated user.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async updateProfile(req, res) {
        const { fullName } = req.body;
        const userId = req.user.id;

        if (!fullName) {
            return res.status(400).json({ message: 'Full name is required.' });
        }

        try {
            await Profile.update(userId, { fullName });
            res.json({ message: 'Profile updated successfully.' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Server error while updating profile.' });
        }
    }
};

module.exports = profileController;
