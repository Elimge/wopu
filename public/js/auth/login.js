// public/js/auth/login.js

import { login } from '../../app/services/authService.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const data = await login(email, password);
            
            localStorage.setItem('accessToken', data.access_token);
            
            const profileComplete = localStorage.getItem('wopu_profile_completed') === 'true';
            if (profileComplete) {
                window.location.href = '../app/index.html#tasks';
            } else {
                window.location.href = '../app/index.html#complete-profile';
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});