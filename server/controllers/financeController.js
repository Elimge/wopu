/**
 * File: server/controllers/financeController.js
 * Description: Handles the business logic for financial transactions.
 */
const Transaction = require('../models/financeModel');

const financeController = {
    /**
     * Creates a new transaction for the authenticated user.
     */
    async createTransaction(req, res) {
        try {
            const { type, category, amount, description, transaction_date } = req.body;
            const userId = req.user.id;

            if (!type || !category || !amount || !transaction_date) {
                return res.status(400).json({ message: 'Type, category, amount, and date are required.' });
            }

            const result = await Transaction.create({
                userId,
                type,
                category,
                amount: parseFloat(amount),
                description,
                transaction_date
            });

            const newTransaction = await Transaction.findById(result.insertId);
            res.status(201).json(newTransaction);

        } catch (error) {
            console.error('Create transaction error:', error);
            res.status(500).json({ message: 'Server error during transaction creation.' });
        }
    },

    /**
     * Retrieves all transactions for the authenticated user.
     */
    async getAllTransactions(req, res) {
        try {
            const userId = req.user.id;
            const transactions = await Transaction.findAllByUserId(userId);
            res.json(transactions);
        } catch (error) {
            console.error('Get all transactions error:', error);
            res.status(500).json({ message: 'Server error while retrieving transactions.' });
        }
    },

    /**
     * Updates an existing transaction.
     */
    async updateTransaction(req, res) {
        try {
            const transactionId = req.params.id;
            const userId = req.user.id;

            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }
            if (transaction.user_id !== userId) {
                return res.status(403).json({ message: 'User not authorized to update this transaction.' });
            }

            const updatedData = { ...transaction, ...req.body }; // Merge new data with old
            await Transaction.update(transactionId, updatedData);

            const updatedTransaction = await Transaction.findById(transactionId);
            res.json(updatedTransaction);

        } catch (error) {
            console.error('Update transaction error:', error);
            res.status(500).json({ message: 'Server error while updating transaction.' });
        }
    },

    /**
     * Deletes a transaction.
     */
    async deleteTransaction(req, res) {
        try {
            const transactionId = req.params.id;
            const userId = req.user.id;

            const transaction = await Transaction.findById(transactionId);
            if (!transaction) {
                return res.status(404).json({ message: 'Transaction not found.' });
            }
            if (transaction.user_id !== userId) {
                return res.status(403).json({ message: 'User not authorized to delete this transaction.' });
            }

            await Transaction.deleteById(transactionId);
            res.json({ message: 'Transaction deleted successfully.' });

        } catch (error) {
            console.error('Delete transaction error:', error);
            res.status(500).json({ message: 'Server error while deleting transaction.' });
        }
    }
};

module.exports = financeController;