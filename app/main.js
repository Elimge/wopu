// app/main.js

document.addEventListener('DOMContentLoaded', function () {
    console.log("App shell loaded. Main.js is running.");

    const sidebarNav = document.querySelector('.sidebar-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const viewContainer = document.getElementById('view-container');

    // --- NUEVO: Objeto para mapear las rutas a los archivos ---
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

    // --- NUEVO: Función para manejar la navegación ---
    function handleNavigation() {
        // Obtenemos el "hash" de la URL (ej: #tasks) y quitamos el #
        const view = window.location.hash.substring(1) || 'tasks'; // 'tasks' por defecto

        setActiveLink(view);
        loadView(view);
    }

    // --- Función para manejar el estado activo de los enlaces (sin cambios) ---
    function setActiveLink(view) {
        navLinks.forEach(link => {
            if (link.dataset.view === view) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // --- Modificamos el listener de clics ---
    sidebarNav.addEventListener('click', function (event) {
        if (event.target.matches('.nav-link')) {
            event.preventDefault();
            const viewName = event.target.dataset.view;

            // Actualizamos el hash de la URL, lo que disparará el evento 'hashchange'
            window.location.hash = viewName;
        }
    });

    // --- NUEVO: Escuchar cambios en el hash de la URL ---
    // Esto se dispara cuando cambiamos el #hash manualmente o con el clic
    window.addEventListener('hashchange', handleNavigation);

    // --- Carga inicial de la vista ---
    // Esto se asegura de que se cargue la vista correcta al entrar a la página
    handleNavigation();
});