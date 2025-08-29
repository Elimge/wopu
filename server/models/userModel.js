
/**
 * File: server/models/userModel.js
 * 
 * This model is responsible for all database operations related to users and their profiles.
 * It abstracts the SQL queries for creating users, finding them by email, and managing profiles.
 */
const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    /**
     * Creates a new user and an associated profile in the database.
     * @param {string} email - The user's email.
     * @param {string} password - The user's plain text password.
     * @returns {Promise<object>} The result object from the database query.
     */
    async create(email, password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            // Insert user
            const [userResult] = await connection.execute(
                'INSERT INTO users (email, password) VALUES (?, ?)',
                [email, hashedPassword]
            );
            
            const userId = userResult.insertId;

            // Insert associated profile
            await connection.execute(
                'INSERT INTO profiles (user_id) VALUES (?)',
                [userId]
            );

            await connection.commit();
            return userResult;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    /**
     * Finds a user by their email address.
     * @param {string} email - The email to search for.
     * @returns {Promise<object|null>} The user object if found, otherwise null.
     */
    async findByEmail(email) {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    },

    /**
     * Finds all users in the database.
     * @returns {Promise<Array>} An array of user objects.
     */
    async findAll() {
        const [rows] = await db.execute(
            'SELECT id, email, role, created_at FROM users ORDER BY id ASC'
        );
        return rows;
    }
};

module.exports = User;
