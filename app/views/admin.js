/**
 * File: app/views/admin.js
 * Description: Handles the admin view, fetching and rendering the user list from the API.
 */
console.log("Admin view script loaded.");

const userListBody = document.getElementById('user-list');

/**
 * Renders the list of users in the admin table.
 * @param {Array} users - Array of user objects to render.
 */
function renderUsers(users) {
    if (!userListBody) {
        console.error("User list body not found!");
        return;
    }
    userListBody.innerHTML = '';

    if (users.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No users found.</td>`;
        userListBody.appendChild(row);
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${user.role}">${user.role}</span></td>
        `;
        userListBody.appendChild(row);
    });
}

/**
 * Fetches the list of all users from the API and calls the render function.
 * Handles errors, including authorization errors if the user is not an admin.
 */
async function fetchAndRenderUsers() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        userListBody.innerHTML = `<tr><td colspan="4">Authentication error. Please log in.</td></tr>`;
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // This will catch 403 Forbidden errors if a non-admin tries to access
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
        }

        const users = await response.json();
        renderUsers(users);

    } catch (error) {
        console.error("Failed to fetch users:", error);
        // Display a helpful error message to the user in the table body
        userListBody.innerHTML = `<tr><td colspan="4" style="color: red; text-align: center;">Error: ${error.message}</td></tr>`;
    }
}

// Initial call to fetch and render the data when the view is loaded.
fetchAndRenderUsers();