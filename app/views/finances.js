// app/views/finances.js

// --- Mock Data para Finanzas ---
let mockTransactions = [
    { id: 101, description: 'Salary', amount: 2500, type: 'income', category: 'Job' },
    { id: 102, description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
    { id: 103, description: 'New book', amount: 20, type: 'expense', category: 'Education' },
    { id: 104, description: 'Freelance Project', amount: 500, type: 'income', category: 'Side Hustle' },
    { id: 105, description: 'Movie tickets', amount: 25, type: 'expense', category: 'Entertainment' },
    { id: 106, description: 'Rent', amount: 800, type: 'expense', category: 'Housing' },
];


// --- Funciones para Renderizar Finanzas ---

const financeSummaryEl = document.getElementById('finance-summary');
const transactionListEl = document.getElementById('transaction-list');

// Función para calcular y mostrar el resumen
function renderFinanceSummary(transactions) {
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    financeSummaryEl.innerHTML = `
        <div class="summary-card">
            <h4>Total Income</h4>
            <p class="income">$${totalIncome.toFixed(2)}</p>
        </div>
        <div class="summary-card">
            <h4>Total Expenses</h4>
            <p class="expenses">$${totalExpenses.toFixed(2)}</p>
        </div>
        <div class="summary-card">
            <h4>Balance</h4>
            <p class="balance">$${balance.toFixed(2)}</p>
        </div>
    `;
}

// Función para mostrar la lista de transacciones
function renderTransactions(transactions) {
    transactionListEl.innerHTML = '';
    if (transactions.length === 0) {
        transactionListEl.innerHTML = '<p class="no-transactions">No transactions yet.</p>';
        return;
    }

    transactions.forEach(t => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        // ¡Importante! Añadimos el ID aquí para poder encontrarlo después
        transactionEl.setAttribute('data-transaction-id', t.id);

        const sign = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expenses';

        transactionEl.innerHTML = `
            <div class="transaction-info">
                <span class="transaction-category">${t.category}</span>
                <p class="transaction-description">${t.description}</p>
            </div>
            <div class="transaction-value">
                <p class="${amountClass}">${sign}$${t.amount.toFixed(2)}</p>
            </div>
            <div class="transaction-actions">
                <button class="btn-icon btn-edit">✏️</button>
                <button class="btn-icon btn-delete">🗑️</button>
            </div>
        `;
        transactionListEl.appendChild(transactionEl);
    });
}


// --- Lógica del Filtro de Finanzas ---

const categoryFilterEl = document.getElementById('transaction-category-filter');

// Función para poblar el dropdown de filtro con categorías únicas
function populateCategoryFilter(transactions) {
    const categories = new Set(transactions.map(t => t.category));

    // Limpiamos las opciones viejas, excepto la primera ("All Categories")
    categoryFilterEl.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterEl.appendChild(option);
    });
}

// Event listener para cuando el usuario cambia la selección del filtro
categoryFilterEl.addEventListener('change', function () {
    const selectedCategory = categoryFilterEl.value;

    let filteredTransactions;

    if (selectedCategory === 'all') {
        // Si se selecciona "All", mostramos todas las transacciones
        filteredTransactions = mockTransactions;
    } else {
        // Si se selecciona una categoría, filtramos el array
        filteredTransactions = mockTransactions.filter(t => t.category === selectedCategory);
    }

    // Volvemos a renderizar la lista con las transacciones filtradas
    // ¡OJO! Solo renderizamos la lista, no el resumen. El resumen siempre mostrará el total.
    renderTransactions(filteredTransactions);
});

// --- Lógica para Renderizar el Gráfico de Finanzas ---

let financeChart = null; // Variable global para guardar la instancia del gráfico

function renderFinanceChart(transactions) {
    const ctx = document.getElementById('finance-chart');
    if (!ctx) return; // Salir si el elemento no existe

    // Calculamos los totales
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    // Si ya existe un gráfico, lo destruimos para evitar errores al redibujar
    if (financeChart) {
        financeChart.destroy();
    }

    // Creamos el nuevo gráfico usando la librería Chart.js
    financeChart = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico de barras
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Total ($)',
                data: [totalIncome, totalExpenses],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)', // Verde
                    'rgba(211, 47, 47, 0.7)'  // Rojo
                ],
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Income vs. Expenses Overview'
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// --- Lógica del Modal de Transacciones ---

const transactionModal = document.getElementById('transaction-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeTransactionModalBtn = document.getElementById('close-transaction-modal-btn');
const transactionForm = document.getElementById('transaction-form');

function openTransactionModal() {
    transactionModal.style.display = 'block';
}

function closeTransactionModal() {
    transactionModal.style.display = 'none';
    transactionForm.reset();
}

addTransactionBtn.addEventListener('click', openTransactionModal);
closeTransactionModalBtn.addEventListener('click', closeTransactionModal);

// --- Lógica para Editar y Eliminar Transacciones ---

// Referencias para el modal de borrado
const deleteTransactionModal = document.getElementById('delete-transaction-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-transaction-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-transaction-btn');
let transactionToDeleteId = null;

// Función para abrir/cerrar el modal de confirmación
function openDeleteModal() { deleteTransactionModal.style.display = 'block'; }
function closeDeleteModal() { deleteTransactionModal.style.display = 'none'; transactionToDeleteId = null; }

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Evento principal en la lista de transacciones (delegación)
transactionListEl.addEventListener('click', function (event) {
    const target = event.target;
    const transactionItem = target.closest('.transaction-item');
    if (!transactionItem) return;

    const transactionId = Number(transactionItem.dataset.transactionId);

    // Si se hace clic en el botón de eliminar
    if (target.closest('.btn-delete')) {
        transactionToDeleteId = transactionId;
        openDeleteModal();
    } else if (target.closest('.btn-edit')) {
        const transactionToEdit = mockTransactions.find(t => t.id === transactionId);
        if (transactionToEdit) {
            // Llenamos el modal existente con los datos
            document.getElementById('transaction-modal-title').textContent = 'Edit Transaction';
            document.getElementById('transaction-id').value = transactionToEdit.id;
            document.getElementById('transaction-description').value = transactionToEdit.description;
            document.getElementById('transaction-amount').value = transactionToEdit.amount;
            document.getElementById('transaction-category').value = transactionToEdit.category;
            document.querySelector(`input[name="type"][value="${transactionToEdit.type}"]`).checked = true;

            openTransactionModal();
        }
    }
});

// Evento para el botón de confirmación final
confirmDeleteBtn.addEventListener('click', function () {
    if (transactionToDeleteId !== null) {
        // 1. Eliminar la transacción del array
        mockTransactions = mockTransactions.filter(t => t.id !== transactionToDeleteId);

        // 2. Volver a renderizar TODO para que se actualice la interfaz
        renderFinanceSummary(mockTransactions);
        renderTransactions(mockTransactions);
        renderFinanceChart(mockTransactions);

        closeDeleteModal();
    }
});

transactionModal.addEventListener('click', function (event) {
    if (event.target === transactionModal) {
        closeTransactionModal();
    }
});

// --- Lógica para Guardar Transacciones ---

transactionForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const description = document.getElementById('transaction-description').value;
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const type = document.querySelector('input[name="type"]:checked').value;
    const category = document.getElementById('transaction-category').value;
    const transactionId = document.getElementById('transaction-id').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    if (transactionId) {
        // LÓGICA DE EDICIÓN
        const index = mockTransactions.findIndex(t => t.id == transactionId);
        if (index !== -1) {
            mockTransactions[index] = { id: Number(transactionId), description, amount, type, category };
        }
    } else {
        // LÓGICA DE CREACIÓN
        mockTransactions.push({ id: Date.now(), description, amount, type, category });
    }

    // Volvemos a renderizar todo
    renderFinanceSummary(mockTransactions);
    renderTransactions(mockTransactions);
    renderFinanceChart(mockTransactions);
    populateCategoryFilter(mockTransactions); // Para actualizar por si hay nuevas categorías

    closeTransactionModal();
});

// --- Carga Inicial de la Vista de Finanzas ---
renderFinanceSummary(mockTransactions);
renderTransactions(mockTransactions);
populateCategoryFilter(mockTransactions);
renderFinanceChart(mockTransactions);
