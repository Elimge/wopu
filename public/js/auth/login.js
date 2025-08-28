// js/auth/login.js 

// 1. Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        try {
            // 1. Recoger los datos del formulario (email y password)
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            // 2. PREPARAR EL CUERPO EN FORMATO x-www-form-urlencoded
            // Usamos URLSearchParams, que es la forma moderna y correcta de crear este formato.
            const body = new URLSearchParams();
            body.append('username', email); // La API espera 'username', le pasamos el email.
            body.append('password', password);
            // La especificación OAuth2 a menudo incluye 'grant_type', es bueno añadirlo.
            body.append('grant_type', 'password');

            console.log('Sending form-urlencoded data to API...');

            // 3. Realizar la llamada fetch con await y los nuevos headers/body
            const response = await fetch('https://wopu-production.up.railway.app/api/login', {
                method: 'POST',
                headers: {
                    // ¡OJO! El Content-Type ha cambiado
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body 
            });

            // 4. MANEJAR LA RESPUESTA
            if (response.ok) {
                const data = await response.json(); // La respuesta exitosa es JSON
                console.log('Login successful, token received:', data);
                
                // --- ¡PASO CRUCIAL! ---
                // Guardamos el token de acceso en el almacenamiento local del navegador.
                // Esta es la "llave" que usaremos para futuras peticiones.
                localStorage.setItem('accessToken', data.access_token);

                alert('Login successful! Redirecting to dashboard...');
                window.location.href = '../dashboard.html';

            } else {
                const errorData = await response.json();
                console.error('Login error:', errorData);
                // El error de login puede ser genérico
                alert('Error: ' + (errorData.detail || 'Invalid credentials.'));
            }

        } catch (error) {
            console.error('Network Error:', error);
            alert('Could not connect to the server. Please try again later.');
        }
    });
});