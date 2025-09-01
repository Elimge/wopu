/**
 * File: app/views/complete-profile.js
 * Manages form submission to update the user's profile information.
 */
import { decodeToken } from '../utils/jwt.js';

const completeProfileForm = document.getElementById('complete-profile-form');

if (completeProfileForm) {
    completeProfileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const fullName = `${firstName} ${lastName}`;
        const dateOfBirth = document.getElementById('dob').value;
        const personalGoal = document.getElementById('personal-goal').value;
        const financialGoal = document.getElementById('financial-goal').value;

        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert('Authentication error. Please log in again.');
            window.location.href = '#login';
            return;
        }

        try {
            const response = await fetch('https://wopu-api.onrender.com/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ fullName, dateOfBirth, personalGoal, financialGoal })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile.');
            }

            const decoded = decodeToken(token);
            if (decoded && decoded.user) {
                // Mark profile as completed ONLY for this specific user
                localStorage.setItem(`wopu_profile_completed_${decoded.user.id}`, 'true');

                // Save the user's name for future sessions
                localStorage.setItem(`wopu_user_name_${decoded.user.id}`, fullName);
            }

            alert('Profile updated successfully!');
            window.location.hash = 'tasks';

        } catch (error) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        }
    });
}
