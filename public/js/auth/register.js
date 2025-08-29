
/**
 * File: public/js/auth/register.js
 *
 * Handles the registration form submission and user registration logic for the Wopu app.
 * Uses the register service and manages redirection after successful registration.
 */

import { register } from '../../app/services/authService.js';


/**
 * Initializes the registration form event listener and handles user registration.
 * On successful registration, redirects to the login page.
 */
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        try {
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            /**
             * Calls the register service with user credentials.
             * @returns {Promise<void>}
             */
            await register(email, password);
            alert('Registration successful! Redirecting to login...');
            window.location.href = 'login.html';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
});