// js/auth/register.js

// 1. Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function() {

    // 2. Obtener referencias a los elementos del formulario.
    const registerForm = document.getElementById('register-form');

    // 3. Añadir un "escuchador" para el evento 'submit' del formulario.
    registerForm.addEventListener('submit', function(event) {
        
        // a. Prevenir el comportamiento por defecto del formulario (que recargaría la página).
        event.preventDefault();

        // b. Recoger los valores de los campos del formulario.
        // new FormData(registerForm) es una forma moderna de obtener todos los datos.
        const formData = new FormData(registerForm);
        // Object.fromEntries convierte los datos del formulario en un objeto JavaScript simple.
        const userData = Object.fromEntries(formData.entries());

        console.log('Sending data:', userData); // Útil para depurar

        // c. Usar la API fetch para enviar los datos al backend.
        // Este es el endpoint que Nelson, el desarrollador de backend, creará.
        fetch('/api/register', {
            method: 'POST', // Usamos el método POST para crear un nuevo recurso (usuario).
            headers: {
                'Content-Type': 'application/json' // Le decimos al servidor que estamos enviando datos en formato JSON.
            },
            body: JSON.stringify(userData) // Convertimos nuestro objeto de datos a una cadena de texto JSON.
        })
        .then(response => {
            // .json() convierte la respuesta del servidor (que viene en formato JSON) a un objeto JavaScript.
            return response.json();
        })
        .then(data => {
            // d. Manejar la respuesta del servidor.
            console.log('Server response:', data); // Útil para depurar

            if (data.success) { // Asumimos que el backend enviará { success: true, ... } si todo va bien.
                // Mostrar un mensaje de éxito.
                alert('Registration successful! Redirecting to login...');
                // Redirigir al usuario a la página de login.
                window.location.href = 'login.html';
            } else {
                // Mostrar un mensaje de error si el backend indica que algo salió mal.
                // Asumimos que el backend enviará { success: false, message: '...' }
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            // Manejar errores de red (ej: el servidor no responde).
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});