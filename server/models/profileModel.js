
/**
 * File: server/models/profileModel.js
 * 
 * This model handles all database operations for the 'profiles' table.
 * It provides methods to get and update user profile information.
 */
const db = require('../config/database');

const Profile = {
    /**
     * Finds a user's profile by their user ID.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<object|null>} The profile object if found, otherwise null.
     */
    async findByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM profiles WHERE user_id = ?',
            [userId]
        );
        return rows[0];
    },

    /**
     * Updates a user's profile.
     * @param {number} userId - The ID of the user whose profile is to be updated.
     * @param {object} profileData - An object containing the data to update.
     * @returns {Promise<object>} The result object from the database query.
     */
    async update(userId, { fullName, dateOfBirth, personalGoal, financialGoal }) {
        const [result] = await db.execute(
            'UPDATE profiles SET full_name = ?, date_of_birth = ?, personal_goal = ?, financial_goal = ?, profile_completed = ? WHERE user_id = ?',
            [fullName, dateOfBirth, personalGoal, financialGoal, true, userId]
        );
        return result;
    }
};

module.exports = Profile;
