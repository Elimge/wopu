/**
 * File: app/views/finances.js
 * Description: Handles the UI and logic for the Finances page, including rendering, modals, filtering, and event listeners.
 */

// Import all required functions from the finance service (single source of data)
import {
    getAllTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '../../app/services/financeService.js';

// --- DOM ELEMENTS AND VARIABLES ---

const financeSummaryEl = document.getElementById('finance-summary');
const transactionListEl = document.getElementById('transaction-list');
const categoryFilterEl = document.getElementById('transaction-category-filter');
const transactionModal = document.getElementById('transaction-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeTransactionModalBtn = document.getElementById('close-transaction-modal-btn');
const transactionForm = document.getElementById('transaction-form');
const deleteTransactionModal = document.getElementById('delete-transaction-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-transaction-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-transaction-btn');

let transactionToDeleteId = null;
let financeChart = null;
let allTransactions = []; // Local cache for all transactions, helps with filtering

// --- RENDERING FUNCTIONS (UI) ---

/**
 * Renders all finance components: summary, transactions, chart, and filter.
 * @param {Array} transactions - Array of transaction objects
 */
function renderAllComponents(transactions) {
    renderFinanceSummary(transactions);
    renderTransactions(transactions);
    renderFinanceChart(transactions);
    populateCategoryFilter(transactions);
    handleFiltering();
}

/**
 * Renders the finance summary (income, expenses, balance).
 * @param {Array} transactions - Array of transaction objects
 */
function renderFinanceSummary(transactions) {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    financeSummaryEl.innerHTML = `
        <div class="summary-card"><h4>Total Income</h4><p class="income">$${totalIncome.toFixed(2)}</p></div>
        <div class="summary-card"><h4>Total Expenses</h4><p class="expenses">$${totalExpenses.toFixed(2)}</p></div>
        <div class="summary-card"><h4>Balance</h4><p class="balance">$${(totalIncome - totalExpenses).toFixed(2)}</p></div>
    `;
}

/**
 * Renders the list of transactions in the UI.
 * @param {Array} transactions - Array of transaction objects
 */
function renderTransactions(transactions) {
    transactionListEl.innerHTML = '';
    if (transactions.length === 0) {
        transactionListEl.innerHTML = '<p class="no-transactions">No transactions found for this category.</p>';
        return;
    }
    transactions.forEach(t => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        transactionEl.dataset.transactionId = t.id;
        const sign = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expenses';
        transactionEl.innerHTML = `
            <div class="transaction-info"><span class="transaction-category">${t.category}</span><p class="transaction-description">${t.description}</p></div>
            <div class="transaction-value"><p class="${amountClass}">${sign}$${t.amount.toFixed(2)}</p></div>
            <div class="transaction-actions"><button class="btn-icon btn-edit">✏️</button><button class="btn-icon btn-delete">🗑️</button></div>
        `;
        transactionListEl.appendChild(transactionEl);
    });
}

/**
 * Renders the finance chart (income vs. expenses) using Chart.js.
 * @param {Array} transactions - Array of transaction objects
 */
function renderFinanceChart(transactions) {
    const ctx = document.getElementById('finance-chart');
    if (!ctx) return;
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    if (financeChart) financeChart.destroy();
    financeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Total ($)',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['rgba(40, 167, 69, 0.7)', 'rgba(211, 47, 47, 0.7)'],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, title: { display: true, text: 'Income vs. Expenses Overview' } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

/**
 * Populates the category filter dropdown with unique categories from transactions.
 * @param {Array} transactions - Array of transaction objects
 */
function populateCategoryFilter(transactions) {
    const categories = new Set(transactions.map(t => t.category));
    categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterEl.appendChild(option);
    });
}

// --- DATA LOGIC ---

/**
 * Fetches all transactions and renders all finance components.
 * Handles errors if fetching fails.
 */
async function fetchAndRenderAll() {
    try {
        allTransactions = await getAllTransactions();
        renderAllComponents(allTransactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
    }
}

/**
 * Handles filtering of transactions by selected category and renders the filtered list.
 */
function handleFiltering() {
    const selectedCategory = categoryFilterEl.value;
    const filtered = selectedCategory === 'all'
        ? allTransactions
        : allTransactions.filter(t => t.category === selectedCategory);
    // Solo renderizamos la lista, el resto de componentes siempre muestran el total
    renderTransactions(filtered);
}

// --- MODAL FUNCTIONS (UI) ---

/**
 * Opens the modal for creating a new transaction and resets the form.
 */
function openModalForCreate() {
    transactionForm.reset();
    document.getElementById('transaction-id').value = '';
    document.getElementById('transaction-modal-title').textContent = 'Add New Transaction';
    transactionModal.style.display = 'block';
}

/**
 * Opens the modal for editing an existing transaction and populates the form.
 * @param {number} transactionId - The ID of the transaction to edit
 */
function openModalForEdit(transactionId) {
    const transaction = allTransactions.find(t => t.id == transactionId);
    if (transaction) {
        transactionForm.reset();
        document.getElementById('transaction-modal-title').textContent = 'Edit Transaction';
        document.getElementById('transaction-id').value = transaction.id;
        document.getElementById('transaction-description').value = transaction.description;
        document.getElementById('transaction-amount').value = transaction.amount;
        document.getElementById('transaction-category').value = transaction.category;
        document.querySelector(`input[name="type"][value="${transaction.type}"]`).checked = true;
        transactionModal.style.display = 'block';
    }
}

/**
 * Closes the transaction modal.
 */
function closeModal() { transactionModal.style.display = 'none'; }
/**
 * Opens the delete confirmation modal for a specific transaction.
 * @param {number} transactionId - The ID of the transaction to delete
 */
function openDeleteModal(transactionId) { transactionToDeleteId = transactionId; deleteTransactionModal.style.display = 'block'; }
/**
 * Closes the delete confirmation modal.
 */
function closeDeleteModal() { transactionToDeleteId = null; deleteTransactionModal.style.display = 'none'; }

// --- EVENT LISTENERS ---

transactionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('transaction-id').value;
    const transactionData = {
        description: document.getElementById('transaction-description').value,
        amount: parseFloat(document.getElementById('transaction-amount').value),
        type: document.querySelector('input[name="type"]:checked').value,
        category: document.getElementById('transaction-category').value
    };
    if (isNaN(transactionData.amount) || transactionData.amount <= 0) {
        return alert('Please enter a valid amount.');
    }
    try {
        if (id) {
            await updateTransaction(id, transactionData);
        } else {
            await createTransaction(transactionData);
        }
        await fetchAndRenderAll();
        closeModal();
    } catch (error) {
        console.error("Error saving transaction:", error);
        alert("Could not save transaction.");
    }
});

transactionListEl.addEventListener('click', (event) => {
    const transactionItem = event.target.closest('.transaction-item');
    if (!transactionItem) return;
    const transactionId = Number(transactionItem.dataset.transactionId);
    if (event.target.closest('.btn-edit')) {
        openModalForEdit(transactionId);
    } else if (event.target.closest('.btn-delete')) {
        openDeleteModal(transactionId);
    }
});

confirmDeleteBtn.addEventListener('click', async () => {
    if (transactionToDeleteId) {
        try {
            await deleteTransaction(transactionToDeleteId);
            await fetchAndRenderAll();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        } finally {
            closeDeleteModal();
        }
    }
});

categoryFilterEl.addEventListener('change', handleFiltering);
addTransactionBtn.addEventListener('click', openModalForCreate);
closeTransactionModalBtn.addEventListener('click', closeModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
transactionModal.addEventListener('click', (event) => { if (event.target === transactionModal) closeModal(); });
deleteTransactionModal.addEventListener('click', (event) => { if (event.target === deleteTransactionModal) closeDeleteModal(); });

// --- INITIAL LOAD ---
fetchAndRenderAll();