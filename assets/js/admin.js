document.addEventListener('DOMContentLoaded', function() {
    
    const userListBody = document.getElementById('user-list');

    // Datos simulados (reemplazar con fetch en el futuro)
    const mockUsers = [
        { id: 1, email: 'miguel.dev@example.com', role: 'admin' },
        { id: 2, email: 'test.user1@example.com', role: 'user' },
        { id: 3, email: 'another.user@example.com', role: 'user' },
    ];

    function renderUsers(users) {
        if (!userListBody) return;
        userListBody.innerHTML = ''; // Limpiar la tabla

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-secondary btn-sm">Edit</button>
                </td>
            `;
            userListBody.appendChild(row);
        });
    }

    // Carga inicial de usuarios
    renderUsers(mockUsers);
});