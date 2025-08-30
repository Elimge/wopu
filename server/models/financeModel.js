/**
 * File: server/models/financeModel.js
 * Description: Handles all database operations for the 'transactions' table.
 */
const db = require('../config/database');

const Transaction = {
    /**
     * Creates a new transaction for a specific user.
     * @param {object} transactionData - The data for the new transaction.
     * @returns {Promise<object>} The result object from the database query.
     */
    async create({ userId, type, category, amount, description, transaction_date }) {
        const [result] = await db.execute(
            'INSERT INTO transactions (user_id, type, category, amount, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, type, category, amount, description, transaction_date]
        );
        return result;
    },

    /**
     * Finds all transactions belonging to a specific user.
     * @param {number} userId - The ID of the user.
     * @returns {Promise<Array>} An array of transaction objects.
     */
    async findAllByUserId(userId) {
        const [rows] = await db.execute(
            'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_date DESC, created_at DESC',
            [userId]
        );
        return rows;
    },

    /**
     * Finds a single transaction by its ID.
     * @param {number} transactionId - The ID of the transaction.
     * @returns {Promise<object|null>} The transaction object if found, otherwise null.
     */
    async findById(transactionId) {
        const [rows] = await db.execute(
            'SELECT * FROM transactions WHERE id = ?',
            [transactionId]
        );
        return rows[0];
    },

    /**
     * Updates an existing transaction.
     * @param {number} transactionId - The ID of the transaction to update.
     * @param {object} transactionData - An object containing the data to update.
     * @returns {Promise<object>} The result object from the database query.
     */
    async update(transactionId, { type, category, amount, description, transaction_date }) {
        const [result] = await db.execute(
            'UPDATE transactions SET type = ?, category = ?, amount = ?, description = ?, transaction_date = ? WHERE id = ?',
            [type, category, amount, description, transaction_date, transactionId]
        );
        return result;
    },

    /**
     * Deletes a transaction by its ID.
     * @param {number} transactionId - The ID of the transaction to delete.
     * @returns {Promise<object>} The result object from the database query.
     */
    async deleteById(transactionId) {
        const [result] = await db.execute(
            'DELETE FROM transactions WHERE id = ?',
            [transactionId]
        );
        return result;
    }
};

module.exports = Transaction;