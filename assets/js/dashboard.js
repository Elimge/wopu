// assets/js/dashboard.js

// Mock Data (Datos Simulados)
// Esto simula la respuesta que obtendríamos de la API de Nelson.
let mockTasks = [
    { id: 1, title: 'Prepare presentation for Monday meeting', category: 'iu' }, // iu: Important & Urgent
    { id: 2, title: 'Plan Q4 marketing strategy', category: 'inu' }, // inu: Important & Not Urgent
    { id: 3, title: 'Answer non-critical emails', category: 'niu' }, // niu: Not Important & Urgent
    { id: 4, title: 'Organize desktop files', category: 'ninu' }, // ninu: Not Important & Not Urgent
    { id: 5, title: 'Pay electricity bill', category: 'iu' },
    { id: 6, title: 'Research new project management tools', category: 'inu' },
    { id: 7, title: 'Renew library books', category: 'ninu' },
];

// --- Mock Data para Finanzas ---
let mockTransactions = [
    { id: 101, description: 'Salary', amount: 2500, type: 'income', category: 'Job' },
    { id: 102, description: 'Groceries', amount: 150, type: 'expense', category: 'Food' },
    { id: 103, description: 'New book', amount: 20, type: 'expense', category: 'Education' },
    { id: 104, description: 'Freelance Project', amount: 500, type: 'income', category: 'Side Hustle' },
    { id: 105, description: 'Movie tickets', amount: 25, type: 'expense', category: 'Entertainment' },
    { id: 106, description: 'Rent', amount: 800, type: 'expense', category: 'Housing' },
];

// Mapeo de categorías a los IDs de los contenedores del HTML
const quadrantMap = {
    iu: 'tasks-iu',
    inu: 'tasks-inu',
    niu: 'tasks-niu',
    ninu: 'tasks-ninu'
};

// Función para renderizar (dibujar) todas las tareas en la matriz
function renderTasks(tasks) {
    // Primero, limpiamos todas las listas para evitar duplicados
    Object.values(quadrantMap).forEach(quadrantId => {
        document.getElementById(quadrantId).innerHTML = '';
    });

    // Luego, iteramos sobre cada tarea y la añadimos a su cuadrante correspondiente
    tasks.forEach(task => {
        const quadrantId = quadrantMap[task.category];
        const taskQuadrant = document.getElementById(quadrantId);
        
        // Creamos el HTML para la tarjeta de la tarea
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('data-task-id', task.id);
        
        taskCard.innerHTML = `
            <p>${task.title}</p>
            <div class="task-actions">
                <button class="btn-icon btn-edit">✏️</button>
                <button class="btn-icon btn-delete">🗑️</button>
            </div>
        `;

        // Añadimos la tarjeta al DOM
        taskQuadrant.appendChild(taskCard);
    });
}

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

// Llamamos a la función cuando el script se carga para mostrar las tareas iniciales
renderTasks(mockTasks);
renderFinanceSummary(mockTransactions);
renderTransactions(mockTransactions);
populateCategoryFilter(mockTransactions); 


// --- Lógica del Modal ---

// 1. Obtener referencias a los elementos del DOM que necesitamos.
const taskModal = document.getElementById('task-modal');
const addTaskBtn = document.getElementById('add-task-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const taskForm = document.getElementById('task-form');
const modalTitle = document.getElementById('modal-title');
const taskIdInput = document.getElementById('task-id'); // El campo oculto
const deleteConfirmModal = document.getElementById('delete-confirm-modal');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

// Variable para guardar temporalmente el ID de la tarea a eliminar
let taskToDeleteId = null;

// 2. Funciones para abrir y cerrar el modal.
function openModal() {
    taskModal.style.display = 'block'; // Cambiamos el display para mostrarlo
}

function closeModal() {
    taskModal.style.display = 'none'; // Lo volvemos a ocultar
    taskForm.reset(); // Limpiamos el formulario cada vez que se cierra
    taskIdInput.value = ''; // Limpiamos el ID oculto
    modalTitle.textContent = 'Add New Task'; // Restauramos el título por si estaba en "Edit Task"
}

function openDeleteModal() {
    deleteConfirmModal.style.display = 'block';
}

function closeDeleteModal() {
    deleteConfirmModal.style.display = 'none';
    taskToDeleteId = null; // Reseteamos el ID
}

// 3. Asignar los eventos a los botones.
addTaskBtn.addEventListener('click', openModal); // Abrir al hacer clic en "Add New Task"
closeModalBtn.addEventListener('click', closeModal); // Cerrar al hacer clic en la 'X'

// 4. (Opcional pero recomendado) Cerrar el modal si el usuario hace clic fuera del contenido.
window.addEventListener('click', function(event) {
    if (event.target == taskModal) {
        closeModal();
    }
});

// --- Lógica para Guardar Tareas (Crear y Editar) ---
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Recogemos los valores del formulario (esto es igual que antes)
    const title = document.getElementById('task-title').value;
    const isImportant = document.querySelector('input[name="importance"]:checked').value === 'true';
    const isUrgent = document.querySelector('input[name="urgency"]:checked').value === 'true';

    // Determinamos la categoría (esto es igual que antes)
    let category = '';
    if (isImportant && isUrgent) category = 'iu';
    else if (isImportant && !isUrgent) category = 'inu';
    else if (!isImportant && isUrgent) category = 'niu';
    else category = 'ninu';

    // Obtenemos el ID del campo oculto
    const taskId = taskIdInput.value;

    // --- AQUÍ ESTÁ LA NUEVA LÓGICA ---
    if (taskId) {
        // Si hay un ID, estamos EDITANDO
        // Encontramos el índice de la tarea en el array
        const taskIndex = mockTasks.findIndex(task => task.id == taskId);
        if (taskIndex !== -1) {
            // Actualizamos la tarea existente
            mockTasks[taskIndex].title = title;
            mockTasks[taskIndex].category = category;
        }
    } else {
        // Si NO hay ID, estamos CREANDO una nueva tarea
        const newTask = {
            id: Date.now(),
            title: title,
            category: category
        };
        mockTasks.push(newTask);
    }

    // Volvemos a "dibujar" y cerramos el modal (esto es igual que antes)
    renderTasks(mockTasks);
    closeModal();
});

// --- Lógica para Editar y Eliminar Tareas ---

const taskMatrix = document.getElementById('task-matrix');

taskMatrix.addEventListener('click', function(event) {
    // Obtenemos el elemento exacto en el que se hizo clic
    const target = event.target;

    // Buscamos el elemento .task-card más cercano al objetivo del clic
    const taskCard = target.closest('.task-card');
    
    // Si no encontramos una tarjeta, no hacemos nada
    if (!taskCard) {
        return;
    }

    // Obtenemos el ID de la tarea desde el atributo data-task-id
    const taskId = Number(taskCard.getAttribute('data-task-id'));

    // --- Lógica de Eliminación ---
    if (target.classList.contains('btn-delete')) {
        // En lugar de confirm(), guardamos el ID y abrimos nuestro modal
        taskToDeleteId = taskId;
        openDeleteModal();
    }

    // --- Lógica de Edición ---
    else if (target.classList.contains('btn-edit')) {
    // 1. Encontrar la tarea en nuestro array de datos
        const taskToEdit = mockTasks.find(task => task.id === taskId);

        if (taskToEdit) {
            // 2. Llenar el formulario del modal con los datos de la tarea
            modalTitle.textContent = 'Edit Task';
            taskIdInput.value = taskToEdit.id; // ¡Muy importante! Guardamos el ID en el campo oculto
            document.getElementById('task-title').value = taskToEdit.title;
        
            // 3. Marcar los radio buttons correctos según la categoría
            const category = taskToEdit.category;
            document.getElementById('important-yes').checked = (category === 'iu' || category === 'inu');
            document.getElementById('important-no').checked = (category === 'niu' || category === 'ninu');
            document.getElementById('urgent-yes').checked = (category === 'iu' || category === 'niu');
            document.getElementById('urgent-no').checked = (category === 'inu' || category === 'ninu');
        
            // 4. Abrir el modal
            openModal();
        }
    }
});

cancelDeleteBtn.addEventListener('click', closeDeleteModal);

// Evento para el botón de confirmación final
confirmDeleteBtn.addEventListener('click', function() {
    if (taskToDeleteId !== null) {
        mockTasks = mockTasks.filter(task => task.id !== taskToDeleteId);
        renderTasks(mockTasks);
        closeDeleteModal(); // Cerramos el modal después de borrar
    }
});

// --- Lógica del Modal de Transacciones ---

// 1. Obtener referencias a los nuevos elementos del DOM
const transactionModal = document.getElementById('transaction-modal');
const addTransactionBtn = document.getElementById('add-transaction-btn');
const closeTransactionModalBtn = document.getElementById('close-transaction-modal-btn');
const transactionForm = document.getElementById('transaction-form');
const transactionModalTitle = document.getElementById('transaction-modal-title');
const transactionIdInput = document.getElementById('transaction-id');

// 2. Funciones para abrir y cerrar el modal
function openTransactionModal() {
    transactionModal.style.display = 'block';
}

function closeTransactionModal() {
    transactionModal.style.display = 'none';
    transactionForm.reset();
    transactionIdInput.value = '';
    transactionModalTitle.textContent = 'Add New Transaction';
}

// 3. Asignar los eventos a los botones
addTransactionBtn.addEventListener('click', openTransactionModal);
closeTransactionModalBtn.addEventListener('click', closeTransactionModal);

// 4. Cerrar al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target == transactionModal) {
        closeTransactionModal();
    }
});

// --- Lógica para Guardar Transacciones ---

transactionForm.addEventListener('submit', function(event) {
    // 1. Prevenimos que la página se recargue
    event.preventDefault();

    // 2. Recogemos los valores del formulario
    const description = document.getElementById('transaction-description').value;
    // Usamos parseFloat para convertir el texto del input en un número decimal
    const amount = parseFloat(document.getElementById('transaction-amount').value);
    const type = document.querySelector('input[name="type"]:checked').value;
    const category = document.getElementById('transaction-category').value;
    
    // Pequeña validación para asegurar que el monto sea un número válido
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    // Por ahora, solo implementamos la lógica de CREAR.
    // Dejaremos la de editar para más adelante.
    const transactionId = transactionIdInput.value;

    if (transactionId) {
        // Lógica de edición (la haremos después si es necesario)
        // ...
    } else {
        // Lógica de creación
        // 3. Creamos el objeto de la nueva transacción
        const newTransaction = {
            id: Date.now(), // ID único temporal
            description: description,
            amount: amount,
            type: type,
            category: category
        };

        // 4. Añadimos la nueva transacción a nuestro array de datos simulados
        mockTransactions.push(newTransaction);
    }

    // 5. Volvemos a "dibujar" TODA la sección de finanzas
    renderFinanceSummary(mockTransactions);
    renderTransactions(mockTransactions);

    // 6. Cerramos y reseteamos el modal
    closeTransactionModal();
});