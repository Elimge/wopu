// app/services/financeService.js

// Movemos los mock data desde finances.js aquí
let mockTransactions = [
    { id: 101, description: 'Salary', amount: 2500, type: 'income', category: 'Job' },
    { id: 102, description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
    // ... (copia el resto de tus transacciones aquí)
];

// --- FUNCIONES CRUD SIMULADAS ---

async function getAllTransactions() {
    console.log("FinanceService: Fetching all transactions (simulated)");
    return [...mockTransactions];
}

async function createTransaction(transactionData) {
    console.log("FinanceService: Creating new transaction (simulated)", transactionData);
    const newTransaction = {
        id: Date.now(),
        ...transactionData
    };
    mockTransactions.push(newTransaction);
    return newTransaction;
}

async function updateTransaction(transactionId, transactionData) {
    console.log(`FinanceService: Updating transaction ${transactionId} (simulated)`, transactionData);
    const index = mockTransactions.findIndex(t => t.id == transactionId);
    if (index !== -1) {
        mockTransactions[index] = { id: Number(transactionId), ...transactionData };
        return mockTransactions[index];
    }
    throw new Error("Transaction not found");
}

async function deleteTransaction(transactionId) {
    console.log(`FinanceService: Deleting transaction ${transactionId} (simulated)`);
    mockTransactions = mockTransactions.filter(t => t.id != transactionId);
    return { success: true };
}

// Exportamos las funciones
export { getAllTransactions, createTransaction, updateTransaction, deleteTransaction };