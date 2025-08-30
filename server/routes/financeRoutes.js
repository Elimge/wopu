/**
 * File: server/routes/financeRoutes.js
 * Description: Defines the API routes for finance-related actions.
 * All routes are protected by the authentication middleware.
 */
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const financeController = require('../controllers/financeController');

// Protect all routes in this file with the authentication middleware.
router.use(authMiddleware);

/**
 * @route   GET /api/finances
 * @desc    Get all transactions for the logged-in user
 * @access  Private
 */
router.get('/', financeController.getAllTransactions);

/**
 * @route   POST /api/finances
 * @desc    Create a new transaction
 * @access  Private
 */
router.post('/', financeController.createTransaction);

/**
 * @route   PUT /api/finances/:id
 * @desc    Update a specific transaction
 * @access  Private
 */
router.put('/:id', financeController.updateTransaction);

/**
 * @route   DELETE /api/finances/:id
 * @desc    Delete a specific transaction
 * @access  Private
 */
router.delete('/:id', financeController.deleteTransaction);

module.exports = router;