// js/auth/login.js 

// 1. Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {

    // 2. Obtener la referencia al formulario de login.
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function(event) {
        
        // a. Prevenir el comportamiento por defecto.
        event.preventDefault();

        // b. Recoger los valores (email y password).
        const formData = new FormData(loginForm);
        const userData = Object.fromEntries(formData.entries());

        console.log('Sending data for login:', userData);

        // c. Usar fetch para enviar los datos al endpoint de login.
        // ¡OJO! El endpoint ahora es /api/login
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);

            if (data.success) {
                alert('Login successful! Redirecting to dashboard...');
                // ¡OJO! La redirección ahora es hacia el dashboard.
                // Usamos ../ para subir un nivel desde la carpeta /pages
                window.location.href = '../dashboard.html'; // Aunque aún no exista, lo dejamos listo.
            } else {
                // El mensaje de error es específico para el login.
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});