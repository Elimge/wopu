// app/views/complete-profile.js

console.log("Complete Profile script loaded.");

const profileForm = document.getElementById('complete-profile-form');

profileForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Recoger los datos del formulario
    const userProfile = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        dob: document.getElementById('dob').value,
        personalGoal: document.getElementById('personal-goal').value,
        financialGoal: document.getElementById('financial-goal').value,
    };

    console.log("Profile data to save:", userProfile);
    
    // --- SIMULACIÓN DE LA LLAMADA A LA API ---
    // En un futuro, aquí haríamos un fetch('api/profile', { method: 'POST', ... })
    // Para guardar los datos en el backend.
    
    // 2. Marcar el perfil como completado en localStorage (simulando la bandera del backend)
    localStorage.setItem('wopu_profile_completed', 'true');

    // 3. (Opcional) Guardamos los datos del perfil en localStorage para usarlos en la app
    localStorage.setItem('wopu_user_profile', JSON.stringify(userProfile));

    // 4. Redirigir al usuario al dashboard de tareas
    alert('Profile complete! Welcome to Wopu.');
    window.location.hash = 'tasks';
});