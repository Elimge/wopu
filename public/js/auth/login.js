/**
 * File: public/js/auth/login.js
 *
 * Handles the login form submission and authentication logic for the Wopu app.
 * Uses the login service and manages redirection based on profile completion.
 */

import { login } from '../../../app/services/authService.js';


/**
 * Initializes the login form event listener and handles authentication.
 * On successful login, stores the access token and redirects based on profile completion.
 */
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            /**
             * Calls the login service with user credentials.
             * @type {{ access_token: string }}
             */
            const data = await login(email, password);

            localStorage.setItem('accessToken', data.access_token);

            /**
             * Checks if the user profile is complete and redirects accordingly.
             * @type {boolean}
             */
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