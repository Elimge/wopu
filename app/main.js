// app/main.js

const viewContainer = document.getElementById('view-container');
const navLinks = document.querySelectorAll('.nav-link');
// Definimos la instancia del tour aquí para que sea accesible
const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
        classes: 'shepherd-wopu-theme',
        scrollTo: true,
        cancelIcon: { enabled: true },
    }
});

const routes = {
    'tasks': {
        html: 'views/tasks.html',
        css: ['assets/css/pages/tasks.css'], // Usamos arrays por si una vista necesita varios CSS
        js: 'views/tasks.js'
    },
    'finances': {
        html: 'views/finances.html',
        css: ['assets/css/pages/finances.css'],
        js: 'views/finances.js'
    },
    'admin': {
        html: 'views/admin.html',
        css: ['assets/css/pages/admin.css'], // Aunque no lo hayamos creado aún, lo dejamos listo
        js: 'views/admin.js' // Igual aquí
    },
    'not-found': {
        html: 'views/not-found.html',
        css: ['assets/css/pages/not-found.css'],
        js: null
    },
    'complete-profile': {
        html: 'views/complete-profile.html',
        css: ['assets/css/pages/complete-profile.css'],
        js: 'views/complete-profile.js' // Lo crearemos en el siguiente paso
    }
};

// --- NUEVO: Función para cargar y mostrar una vista ---
async function loadView(view) {
    const route = routes[view];

    if (!route) {
        console.error(`View "${view}" not found.`);
        viewContainer.innerHTML = '<h1>404 - Page Not Found</h1>';
        return;
    }

    // --- Limpieza de Recursos Anteriores ---
    // Removemos los CSS y JS de la vista anterior para evitar conflictos
    document.querySelectorAll('.dynamic-style, .dynamic-script').forEach(el => el.remove());

    try {
        // 1. Cargar el HTML (como antes)
        const response = await fetch(route.html);
        if (!response.ok) throw new Error(`Failed to load HTML: ${response.statusText}`);
        const htmlContent = await response.text();
        viewContainer.innerHTML = htmlContent;

        // 2. Cargar los CSS dinámicamente
        route.css.forEach(cssPath => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.classList.add('dynamic-style'); // Clase para poder removerlo después
            document.head.appendChild(link);
        });

        // 3. Cargar el JS dinámicamente
        // Añadimos un timestamp para evitar problemas de caché durante el desarrollo
        const script = document.createElement('script');
        script.src = `${route.js}?t=${new Date().getTime()}`;
        script.type = 'module'; // Usar 'module' es una buena práctica moderna
        script.classList.add('dynamic-script'); // Clase para poder removerlo después
        document.body.appendChild(script);

        console.log(`Successfully loaded view: ${view}`);

    } catch (error) {
        console.error('Error loading view:', error);
        viewContainer.innerHTML = `<h1>Error loading page. Please try again.</h1>`;
    }
}

function setActiveLink(view) {
    navLinks.forEach(link => {
        // Se añade la condición view !== 'not-found'
        if (link.dataset.view === view && view !== 'not-found') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

let isTourRunning = false;

function handleNavigation() {
    let view = window.location.hash.substring(1) || 'tasks';

    // --- AQUÍ ESTÁ EL CAMBIO ---
    // Si la ruta solicitada no existe en nuestro objeto de rutas,
    // forzamos la vista a ser 'not-found'.
    if (!routes[view]) {
        view = 'not-found';
        window.location.hash = 'not-found'; // Actualizamos la URL también
    }

    setActiveLink(view);
    loadView(view);

    // --- AÑADIR ESTE BLOQUE ---
    // Lanzador del Tutorial: Lo iniciamos solo si el tutorial no está completado
    // Y si la vista cargada es la primera del tour (tasks).
    if (!isTourRunning && !localStorage.getItem('wopu_tutorial_completed')) {
        // Ponemos la bandera a true INMEDIATAMENTE para que no se vuelva a lanzar
        isTourRunning = true;
        // Lanzamos el tour. Usamos un pequeño retraso para que la primera vista cargue bien.
        setTimeout(startOnboardingTour, 500);
    }
}

function startOnboardingTour() {
    // Limpiamos los pasos anteriores por si acaso
    tour.steps = [];

    // --- Pasos de la Vista de Tareas ---
    tour.addStep({
        id: 'step-1-welcome',
        text: `Welcome to Wopu! 👋 Let's take a quick 2-minute tour of the main features.`,
        buttons: [{ text: 'Let\'s Go! →', action: tour.next }]
    });

    tour.addStep({
        id: 'step-2-add-task',
        title: 'Creating a Task',
        text: 'Everything starts here. Click this button to open the form where you can add a new task.',
        attachTo: { element: '#add-task-btn', on: 'bottom' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'step-3-quadrants',
        title: 'The Eisenhower Matrix',
        text: 'Your tasks will appear in one of these four quadrants, helping you prioritize what to do first: <br><br> <strong>🔴 Do First</strong> (Urgent & Important) <br> <strong>🔵 Schedule</strong> (Important, Not Urgent)',
        attachTo: { element: '#task-matrix', on: 'bottom' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'step-4-status',
        title: 'Updating Progress',
        text: 'You can easily update a task\'s status directly from the card. Completed tasks will be visually marked.',
        attachTo: { element: '.task-status-selector', on: 'right' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    // --- Paso de Navegación ---
    tour.addStep({
        id: 'step-5-navigation',
        title: 'Switching Views',
        text: 'Great! Now, let\'s check out the Finances section using the sidebar.',
        attachTo: { element: 'a[data-view="finances"]', on: 'right' },
        buttons: [
            { text: 'Back', action: tour.back },
            {
                text: 'Go to Finances →',
                action: async function () {
                    window.location.hash = 'finances'; // Cambiamos la URL
                    // Pequeña pausa para asegurar que la vista y su JS se cargan
                    await new Promise(r => setTimeout(r, 100));
                    tour.next();
                }
            }
        ]
    });

    // --- Pasos de la Vista de Finanzas ---
    tour.addStep({
        id: 'step-6-finance-summary',
        title: 'Your Financial Snapshot',
        text: 'Here you can see a quick summary of your income, expenses, and current balance.',
        attachTo: { element: '#finance-summary', on: 'bottom' },
        buttons: [{ text: 'Back', action: () => { window.location.hash = 'tasks'; tour.back(); } }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'step-7-add-transaction',
        title: 'Adding Transactions',
        text: 'Use this button to log a new income or expense. Keeping this updated is key!',
        attachTo: { element: '#add-transaction-btn', on: 'bottom' },
        buttons: [{ text: 'Back', action: tour.back }, { text: 'Next', action: tour.next }]
    });

    tour.addStep({
        id: 'step-8-finish',
        title: 'You\'re All Set!',
        text: 'That\'s it for the tour. You\'re ready to start organizing your life and finances. Enjoy!',
        buttons: [{ text: 'Finish', action: tour.complete }]
    });

    // Lógica para marcar como completado
    const onTourEnd = () => {
        localStorage.setItem('wopu_tutorial_completed', 'true');
        isTourRunning = false; // Reseteamos la bandera
    };
    tour.on('complete', onTourEnd);
    tour.on('cancel', onTourEnd);

    tour.start();
}

// --- El Código se Ejecuta una vez que el DOM está listo ---
document.addEventListener('DOMContentLoaded', function () {
    console.log("App shell loaded. Main.js is running.");

    const sidebarNav = document.querySelector('.sidebar-nav');

    sidebarNav.addEventListener('click', function (event) {
        if (event.target.matches('.nav-link')) {
            event.preventDefault();
            const viewName = event.target.dataset.view;
            window.location.hash = viewName;
        }
    });

    window.addEventListener('hashchange', handleNavigation);

    // Carga inicial
    handleNavigation();
});
