
/**
 * File: server/controllers/authController.js
 * 
 * This controller handles the logic for user authentication, including registration and login.
 * It uses the userModel to interact with the database and JWT for session management.
 */
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    /**
     * Handles user registration.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async register(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already in use.' });
            }

            await User.create(email, password);

            res.status(201).json({ message: 'User registered successfully.' });

        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Server error during registration.' });
        }
    },

    /**
     * Handles user login.
     * @param {object} req - The Express request object.
     * @param {object} res - The Express response object.
     */
    async login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        try {
            const user = await User.findByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            const payload = {
                user: {
                    id: user.id,
                    role: user.role
                }
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Login successful.',
                accessToken: token
            });

        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Server error during login.' });
        }
    }
};

module.exports = authController;
