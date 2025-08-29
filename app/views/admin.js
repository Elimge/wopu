
/**
 * File: app/views/admin.js
 * Description: Handles the admin view, including rendering the user list table with mock data.
 */

console.log("Admin view script loaded.");

const userListBody = document.getElementById('user-list');

const mockUsers = [
    { id: 1, email: 'miguel.dev@example.com', role: 'admin' },
    { id: 2, email: 'test.user1@example.com', role: 'user' },
    { id: 3, email: 'another.user@example.com', role: 'user' },
    { id: 4, email: 'qa.tester@example.com', role: 'user' },
];

/**
 * Renders the list of users in the admin table.
 * @param {Array} users - Array of user objects to render
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
            <td>
                <button class="btn btn-secondary btn-sm">Edit</button>
            </td>
        `;
        userListBody.appendChild(row);
    });
}

renderUsers(mockUsers);