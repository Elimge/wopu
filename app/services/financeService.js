/**
 * File: app/services/financeService.js
 * Description: Provides simulated CRUD operations for financial transactions using mock data.
 */

// Mock data for transactions
let mockTransactions = [
    { id: 101, description: 'Salary', amount: 2500, type: 'income', category: 'Job' },
    { id: 102, description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
    // ... (copia el resto de tus transacciones aquí)
];

// --- Simulated CRUD functions ---

/**
 * Retrieves all transactions (simulated).
 * @returns {Promise<Array>} Array of transaction objects
 */
async function getAllTransactions() {
    console.log("FinanceService: Fetching all transactions (simulated)");
    return [...mockTransactions];
}

/**
 * Creates a new transaction (simulated).
 * @param {Object} transactionData - Data for the new transaction
 * @returns {Promise<Object>} The created transaction object
 */
async function createTransaction(transactionData) {
    console.log("FinanceService: Creating new transaction (simulated)", transactionData);
    const newTransaction = {
        id: Date.now(),
        ...transactionData
    };
    mockTransactions.push(newTransaction);
    return newTransaction;
}

/**
 * Updates an existing transaction (simulated).
 * @param {number} transactionId - ID of the transaction to update
 * @param {Object} transactionData - Updated transaction data
 * @returns {Promise<Object>} The updated transaction object
 * @throws {Error} If transaction is not found
 */
async function updateTransaction(transactionId, transactionData) {
    console.log(`FinanceService: Updating transaction ${transactionId} (simulated)`, transactionData);
    const index = mockTransactions.findIndex(t => t.id == transactionId);
    if (index !== -1) {
        mockTransactions[index] = { id: Number(transactionId), ...transactionData };
        return mockTransactions[index];
    }
    throw new Error("Transaction not found");
}

/**
 * Deletes a transaction (simulated).
 * @param {number} transactionId - ID of the transaction to delete
 * @returns {Promise<Object>} Success status
 */
async function deleteTransaction(transactionId) {
    console.log(`FinanceService: Deleting transaction ${transactionId} (simulated)`);
    mockTransactions = mockTransactions.filter(t => t.id != transactionId);
    return { success: true };
}

// Export CRUD functions for use in other modules
export { getAllTransactions, createTransaction, updateTransaction, deleteTransaction };