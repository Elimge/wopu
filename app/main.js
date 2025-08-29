/**
 * File: app/main.js
 *
 * Main entry point for the Wopu frontend application.
 * Handles view routing, dynamic loading of HTML/CSS/JS, navigation, and onboarding tour logic.
 */

import { decodeToken } from './utils/jwt.js';

const viewContainer = document.getElementById('view-container');
const navLinks = document.querySelectorAll('.nav-link');

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
        css: ['assets/css/pages/tasks.css'],
        js: 'views/tasks.js'
    },
    'finances': {
        html: 'views/finances.html',
        css: ['assets/css/pages/finances.css'],
        js: 'views/finances.js'
    },
    'admin': {
        html: 'views/admin.html',
        css: ['assets/css/pages/admin.css'],
        js: 'views/admin.js'
    },
    'not-found': {
        html: 'views/not-found.html',
        css: ['assets/css/pages/not-found.css'],
        js: null
    },
    'complete-profile': {
        html: 'views/complete-profile.html',
        css: ['assets/css/pages/complete-profile.css'],
        js: 'views/complete-profile.js'
    }
};

async function loadView(view) {
    const route = routes[view];
    if (!route) {
        console.error(`View "${view}" not found.`);
        viewContainer.innerHTML = '<h1>404 - Page Not Found</h1>';
        return;
    }
    document.querySelectorAll('.dynamic-style, .dynamic-script').forEach(el => el.remove());
    try {
        const response = await fetch(route.html);
        if (!response.ok) throw new Error(`Failed to load HTML: ${response.statusText}`);
        const htmlContent = await response.text();
        viewContainer.innerHTML = htmlContent;
        route.css.forEach(cssPath => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.classList.add('dynamic-style');
            document.head.appendChild(link);
        });
        if (route.js) { // Check if a JS file exists for the route
            const script = document.createElement('script');
            script.src = `${route.js}?t=${new Date().getTime()}`;
            script.type = 'module';
            script.classList.add('dynamic-script');
            document.body.appendChild(script);
        }
        console.log(`Successfully loaded view: ${view}`);
    } catch (error) {
        console.error('Error loading view:', error);
        viewContainer.innerHTML = `<h1>Error loading page. Please try again.</h1>`;
    }
}

function setActiveLink(view) {
    navLinks.forEach(link => {
        if (link.dataset.view === view && view !== 'not-found') {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Updates the welcome message in the sidebar with the user's name from localStorage.
 * @param {string|number} userId - The ID of the current user.
 */
function updateWelcomeMessage(userId) {
    const welcomeElement = document.getElementById('user-welcome-message');
    if (welcomeElement && userId) {
        const userName = localStorage.getItem(`wopu_user_name_${userId}`);
        if (userName) {
            // If the name is found, display it.
            welcomeElement.innerHTML = `Welcome, <br><strong>${userName}</strong>`;
            welcomeElement.style.display = 'block'; // Make sure it's visible
        } else {
            // If no name is stored yet, hide the element.
            welcomeElement.style.display = 'none';
        }
    }
}

let isTourRunning = false;

function handleNavigation() {
    const token = localStorage.getItem('accessToken');
    const decodedToken = decodeToken(token);
    const userRole = decodedToken ? decodedToken.user.role : null;
    const userId = decodedToken ? decodedToken.user.id : null;

    // Update the welcome message on every view change.
    updateWelcomeMessage(userId);

    const adminLink = document.querySelector('a[data-view="admin"]');
    if (adminLink) {
        if (userRole === 'admin') {
            adminLink.style.display = 'block';
        } else {
            adminLink.style.display = 'none';
        }
    }

    let view = window.location.hash.substring(1) || 'tasks';

    if (view === 'admin' && userRole !== 'admin') {
        view = 'tasks';
        window.location.hash = 'tasks';
    }

    if (!routes[view]) {
        view = 'not-found';
        window.location.hash = 'not-found';
    }

    setActiveLink(view);
    loadView(view);
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
        const token = localStorage.getItem('accessToken');
        const decoded = decodeToken(token);
        if (decoded && decoded.user) {
            // Mark tutorial as completed for THIS SPECIFIC USER
            localStorage.setItem(`wopu_tutorial_completed_${decoded.user.id}`, 'true');
        }
        isTourRunning = false;
    };
    tour.on('complete', onTourEnd);
    tour.on('cancel', onTourEnd);

    tour.start();
}

// Run main logic once DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log("App shell loaded. Main.js is running.");

    // --- Navigation Listeners ---
    const sidebarNav = document.querySelector('.sidebar-nav');
    sidebarNav.addEventListener('click', function (event) {
        if (event.target.matches('.nav-link')) {
            event.preventDefault();
            const viewName = event.target.dataset.view;
            window.location.hash = viewName;
        }
    });
    window.addEventListener('hashchange', handleNavigation);

    // Initial page load
    handleNavigation();

    // --- Logout Button Logic ---
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const confirmLogout = confirm('Are you sure you want to log out?');
            if (confirmLogout) {
                localStorage.removeItem('accessToken');
                window.location.href = '../auth/login.html';
            }
        });
    }

    // --- ONBOARDING TOUR LOGIC (RUNS ONLY ONCE) ---
    // This is the correct place to decide if the tour should start.
    const token = localStorage.getItem('accessToken');
    const decoded = decodeToken(token);
    if (decoded && decoded.user) {
        const userId = decoded.user.id;
        const tutorialCompleted = localStorage.getItem(`wopu_tutorial_completed_${userId}`) === 'true';
        const profileCompleted = localStorage.getItem(`wopu_profile_completed_${userId}`) === 'true';

        // Start the tour only if the profile is complete and the tour hasn't been seen.
        if (profileCompleted && !tutorialCompleted) {
            // Use a small delay to ensure the initial view (e.g., tasks) has loaded its elements.
            setTimeout(startOnboardingTour, 500);
        }
    }
});
