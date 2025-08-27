// js/auth/register.js

// 1. Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');

    // Convertimos la función del listener en una función 'async'
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Creamos un bloque try...catch para un mejor manejo de errores
        try {
            // 1. Recoger los datos del formulario
            const formData = new FormData(registerForm);
            
            // 2. CREAR UN OBJETO SOLO CON LOS DATOS QUE LA API ACEPTA
            const dataToSend = {
                email: formData.get('email'),
                password: formData.get('password')
            };

            console.log('Sending data to API:', dataToSend);

            // 3. Realizar la llamada fetch usando await
            const response = await fetch('https://wopu-production.up.railway.app/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            // 4. MANEJAR LA RESPUESTA
            // response.ok es true si el código de estado es 2xx (ej: 200, 201)
            if (response.ok) { 
                const successMessage = await response.text(); // La API devuelve texto, no JSON
                console.log('Success response:', successMessage);
                
                alert('Registration successful! Redirecting to login...');
                window.location.href = 'login.html';
            } else {
                // Si hay un error de validación (código 422), la API devuelve un JSON
                const errorData = await response.json();
                console.error('Validation error:', errorData);
                // Mostramos el primer mensaje de error que encontremos
                const errorMessage = errorData.detail[0]?.msg || 'An unknown error occurred.';
                alert('Error: ' + errorMessage);
            }

        } catch (error) {
            // Manejar errores de red (ej: no hay conexión, el servidor está caído)
            console.error('Network Error:', error);
            alert('Could not connect to the server. Please try again later.');
        }
    });
});