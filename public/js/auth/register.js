// public/js/auth/register.js

import { register } from '../../app/services/authService.js';

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            await register(email, password);
            alert('Registration successful! Redirecting to login...');
            window.location.href = 'login.html';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});