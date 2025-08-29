
/**
 * File: app/services/authService.js
 * Description: Provides authentication services for user registration and login using the Wopu API.
 */

const API_BASE_URL = 'https://wopu-production.up.railway.app/api';

/**
 * Registers a new user with the provided email and password.
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<string>} Success message from the API
 * @throws {Error} If registration fails
 */
async function register(email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
    return await response.text(); // Returns success message
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail[0]?.msg || 'Registration failed.');
    }
}

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object>} Object containing access_token and token_type
 * @throws {Error} If login fails
 */
async function login(email, password) {
    const body = new URLSearchParams();
    body.append('username', email);
    body.append('password', password);

    const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    if (response.ok) {
    return await response.json(); // Returns { access_token, token_type }
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid credentials.');
    }
}

// Export authentication functions for use in other modules
export { register, login };