
/**
 * File: app/main.js
 *
 * Main entry point for the Wopu frontend application.
 * Handles view routing, dynamic loading of HTML/CSS/JS, navigation, and onboarding tour logic.
 */

const viewContainer = document.getElementById('view-container');
const navLinks = document.querySelectorAll('.nav-link');
/**
 * Shepherd tour instance for onboarding. Accessible throughout the app.
 */
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
    css: ['assets/css/pages/tasks.css'], // Use arrays in case a view needs multiple CSS files
        js: 'views/tasks.js'
    },
    'finances': {
        html: 'views/finances.html',
        css: ['assets/css/pages/finances.css'],
        js: 'views/finances.js'
    },
    'admin': {
        html: 'views/admin.html',
    css: ['assets/css/pages/admin.css'], // Placeholder for future admin CSS
    js: 'views/admin.js' // Placeholder for future admin JS
    },
    'not-found': {
        html: 'views/not-found.html',
        css: ['assets/css/pages/not-found.css'],
        js: null
    },
    'complete-profile': {
        html: 'views/complete-profile.html',
    css: ['assets/css/pages/complete-profile.css'],
    js: 'views/complete-profile.js' // Will be created in the next step
    }
};

/**
 * Dynamically loads and displays a view (HTML, CSS, JS) based on the given route.
 * Cleans up previous resources to avoid conflicts.
 * @param {string} view - The name of the view to load.
 * @returns {Promise<void>}
 */
async function loadView(view) {
    const route = routes[view];

    if (!route) {
        console.error(`View "${view}" not found.`);
        viewContainer.innerHTML = '<h1>404 - Page Not Found</h1>';
        return;
    }

    // Remove previous dynamic CSS and JS to avoid conflicts
    document.querySelectorAll('.dynamic-style, .dynamic-script').forEach(el => el.remove());

    try {
    // 1. Load HTML content
        const response = await fetch(route.html);
        if (!response.ok) throw new Error(`Failed to load HTML: ${response.statusText}`);
        const htmlContent = await response.text();
        viewContainer.innerHTML = htmlContent;

    // 2. Dynamically load CSS
        route.css.forEach(cssPath => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.classList.add('dynamic-style'); // Clase para poder removerlo después
            document.head.appendChild(link);
        });

    // 3. Dynamically load JS
    // Add a timestamp to avoid cache issues during development
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


/**
 * Sets the active navigation link based on the current view.
 * @param {string} view - The current view name.
 */
function setActiveLink(view) {
    navLinks.forEach(link => {
        // Only set active if not 'not-found'
        if (link.dataset.view === view && view !== 'not-found') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

let isTourRunning = false;


/**
 * Handles navigation changes (hash changes) and loads the appropriate view.
 * Also starts the onboarding tour if needed.
 */
function handleNavigation() {
    let view = window.location.hash.substring(1) || 'tasks';

    // If the requested route does not exist, force 'not-found' view
    if (!routes[view]) {
        view = 'not-found';
        window.location.hash = 'not-found';
    }

    setActiveLink(view);
    loadView(view);

    // Launch onboarding tour if not completed and on first view
    if (!isTourRunning && !localStorage.getItem('wopu_tutorial_completed')) {
        isTourRunning = true;
        setTimeout(startOnboardingTour, 500);
    }
}


/**
 * Initializes and starts the onboarding tour using Shepherd.js.
 * Steps cover main features in tasks and finances views.
 */
function startOnboardingTour() {
    // Clear previous steps just in case
    tour.steps = [];

    // --- Tasks View Steps ---
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

    // --- Navigation Step ---
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
                    window.location.hash = 'finances';
                    await new Promise(r => setTimeout(r, 100));
                    tour.next();
                }
            }
        ]
    });

    // --- Finances View Steps ---
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

    // Mark tutorial as completed in localStorage and reset flag
    const onTourEnd = () => {
        localStorage.setItem('wopu_tutorial_completed', 'true');
        isTourRunning = false;
    };
    tour.on('complete', onTourEnd);
    tour.on('cancel', onTourEnd);

    tour.start();
}


// Run main logic once DOM is ready
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

    // Initial load
    handleNavigation();
});
