
/**
 * File: app/services/authService.js
 * Description: Provides authentication services for user registration and login using the local Wopu API.
 */

const API_URL = 'http://localhost:3000/api/auth';

/**
 * Registers a new user by making a POST request to the backend API.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The JSON response from the server.
 * @throws {Error} If registration fails.
 */
export async function register(email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
    }

    return response.json();
}

/**
 * Logs in a user by making a POST request to the backend API.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} An object containing the access token.
 * @throws {Error} If login fails.
 */
export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
    }

    const data = await response.json();
    // The backend returns `accessToken`, so we adapt the frontend to use it.
    // The original frontend expects `access_token`, so we perform this mapping.
    return { access_token: data.accessToken };
}
