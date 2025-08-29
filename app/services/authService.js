// app/services/authService.js

const API_BASE_URL = 'https://wopu-production.up.railway.app/api';

// Función para registrar un nuevo usuario
async function register(email, password) {
    const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        return await response.text(); // Devuelve el mensaje de éxito
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail[0]?.msg || 'Registration failed.');
    }
}

// Función para iniciar sesión
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
        return await response.json(); // Devuelve { access_token, token_type }
    } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Invalid credentials.');
    }
}

// Exportamos las funciones para poder usarlas en otros archivos
export { register, login };