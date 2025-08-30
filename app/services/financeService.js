/**
 * File: app/services/financeService.js
 * Description: Provides CRUD operations for financial transactions by communicating with the backend API.
 */

// API base URL for finance-related endpoints
const API_URL = 'http://localhost:3000/api/finances';

/**
 * A helper function to create authorization headers.
 * @returns {Headers} A Headers object with the Authorization token.
 */
function _getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
}

/**
 * Retrieves all transactions from the backend.
 * @returns {Promise<Array>} Array of transaction objects.
 */
async function getAllTransactions() {
    console.log("FinanceService: Fetching all transactions from API");
    const response = await fetch(API_URL, {
        method: 'GET',
        headers: _getAuthHeaders()
    });

    if (!response.ok) {
        throw new Error('Failed to fetch transactions.');
    }
    // The backend returns dates as strings (e.g., "2025-08-29T00:00:00.000Z").
    // The frontend chart and logic can handle this format, so no mapping is needed for now.
    return response.json();
}

/**
 * Creates a new transaction via the backend API.
 * @param {Object} transactionData - Data for the new transaction.
 * @returns {Promise<Object>} The created transaction object.
 */
async function createTransaction(transactionData) {
    console.log("FinanceService: Creating new transaction via API", transactionData);

    // The frontend form already sends a 'transaction_date' field, which matches the backend.
    // We just need to ensure the amount is a number.
    const payload = {
        ...transactionData,
        amount: parseFloat(transactionData.amount)
    };

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: _getAuthHeaders(),
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create transaction.');
    }
    return response.json();
}

/**
 * Updates an existing transaction via the backend API.
 * @param {number} transactionId - ID of the transaction to update.
 * @param {Object} transactionData - Updated transaction data.
 * @returns {Promise<Object>} The updated transaction object.
 */
async function updateTransaction(transactionId, transactionData) {
    console.log(`FinanceService: Updating transaction ${transactionId} via API`, transactionData);
    const response = await fetch(`${API_URL}/${transactionId}`, {
        method: 'PUT',
        headers: _getAuthHeaders(),
        body: JSON.stringify(transactionData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update transaction.');
    }
    return response.json();
}

/**
 * Deletes a transaction via the backend API.
 * @param {number} transactionId - ID of the transaction to delete.
 * @returns {Promise<Object>} Success status.
 */
async function deleteTransaction(transactionId) {
    console.log(`FinanceService: Deleting transaction ${transactionId} via API`);
    const response = await fetch(`${API_URL}/${transactionId}`, {
        method: 'DELETE',
        headers: _getAuthHeaders()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete transaction.');
    }
    return response.json();
}

// Export CRUD functions for use in other modules
export { getAllTransactions, createTransaction, updateTransaction, deleteTransaction };