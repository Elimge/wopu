// js/auth/login.js 

// 1. Esperar a que el DOM esté completamente cargado.
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        try {
            // 1. Recoger los datos del formulario (email y password)
            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            // 2. PREPARAR EL CUERPO EN FORMATO x-www-form-urlencoded
            // Usamos URLSearchParams, que es la forma moderna y correcta de crear este formato.
            const body = new URLSearchParams();
            body.append('username', formData.get('email'));
            body.append('password', formData.get('password'));

            const response = await fetch('https://wopu-production.up.railway.app/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('accessToken', data.access_token);

                // --- LÓGICA DE REDIRECCIÓN MEJORADA ---

                // 1. SIMULAMOS la respuesta de la API. Asumiremos que nos dice si el perfil está completo.
                // En el futuro, esto sería: const profileComplete = data.profile_complete;
                // Por ahora, lo simulamos comprobando nuestro localStorage.
                const profileComplete = localStorage.getItem('wopu_profile_completed') === 'true';

                if (profileComplete) {
                    // 2. Si el perfil está completo, vamos directo al dashboard.
                    window.location.href = '../app/index.html#tasks';
                } else {
                    // 3. Si NO está completo, vamos a la página de completar perfil.
                    window.location.href = '../app/index.html#complete-profile';
                }

            } else {
                const errorData = await response.json();
                alert('Error: ' + (errorData.detail || 'Invalid credentials.'));
            }

        } catch (error) {
            console.error('Network Error:', error);
            alert('Could not connect to the server. Please try again later.');
        }
    });
});