/**
 * File: public/js/auth/login.js
 * Handles login form submission and redirects based on profile completion.
 */
import { login } from '../../../app/services/authService.js';

// Helper function to decode the token payload
function decodeToken(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error("Error decoding token:", e);
        return null;
    }
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        try {
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const data = await login(email, password);

            localStorage.setItem('accessToken', data.access_token);

            const decoded = decodeToken(data.access_token);
            if (decoded && decoded.user) {
                const userId = decoded.user.id;
                const profileComplete = localStorage.getItem(`wopu_profile_completed_${userId}`) === 'true';

                if (profileComplete) {
                    window.location.href = '../app/index.html#tasks';
                } else {
                    window.location.href = '../app/index.html#complete-profile';
                }
            } else {
                window.location.href = '../app/index.html#complete-profile';
            }

        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}