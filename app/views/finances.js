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
    // Limpiamos la lista primero
    transactionListEl.innerHTML = '';

    if (transactions.length === 0) {
        transactionListEl.innerHTML = '<p class="no-transactions">No transactions yet.</p>';
        return;
    }
    
    transactions.forEach(t => {
        const transactionEl = document.createElement('div');
        transactionEl.className = 'transaction-item';
        
        const sign = t.type === 'income' ? '+' : '-';
        const amountClass = t.type === 'income' ? 'income' : 'expenses';

        transactionEl.innerHTML = `
            <div class="transaction-details">
                <span class="transaction-category">${t.category}</span>
                <p class="transaction-description">${t.description}</p>
            </div>
            <div class="transaction-amount">
                <p class="${amountClass}">${sign}$${t.amount.toFixed(2)}</p>
            </div>
        `;
        transactionListEl.appendChild(transactionEl);
    });
}


// --- Lógica del Filtro de Finanzas ---

const categoryFilterEl = document.getElementById('transaction-category-filter');

// Función para poblar el dropdown de filtro con categorías únicas
function populateCategoryFilter(transactions) {
    // Usamos un Set para obtener solo los nombres de categoría únicos
    const categories = new Set(transactions.map(t => t.category));
    
    // Mantenemos la opción "All Categories" que ya está en el HTML
    // y solo añadimos las nuevas
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilterEl.appendChild(option);
    });
}

// Event listener para cuando el usuario cambia la selección del filtro
categoryFilterEl.addEventListener('change', function() {
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