// app/views/admin.js

console.log("Admin view script loaded.");

// Obtenemos la referencia al cuerpo de la tabla
const userListBody = document.getElementById('user-list');

// Datos simulados (reemplazar con fetch en el futuro)
const mockUsers = [
    { id: 1, email: 'miguel.dev@example.com', role: 'admin' },
    { id: 2, email: 'test.user1@example.com', role: 'user' },
    { id: 3, email: 'another.user@example.com', role: 'user' },
    { id: 4, email: 'qa.tester@example.com', role: 'user' },
];

// Función para renderizar los usuarios en la tabla
function renderUsers(users) {
    if (!userListBody) {
        console.error("User list body not found!");
        return;
    }
    userListBody.innerHTML = ''; // Limpiar la tabla antes de añadir nuevas filas

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

// Carga inicial de usuarios al cargar la vista
renderUsers(mockUsers);