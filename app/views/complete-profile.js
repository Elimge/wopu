/**
 * File: app/views/complete-profile.js
 *
 * This script handles the logic for the complete profile page.
 * It manages form submission to update the user's profile information.
 */

document.addEventListener('DOMContentLoaded', () => {
    const completeProfileForm = document.getElementById('complete-profile-form');

    if (completeProfileForm) {
        completeProfileForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const fullName = document.getElementById('full-name').value;
            const token = localStorage.getItem('accessToken');

            if (!token) {
                alert('Authentication error. Please log in again.');
                window.location.href = '#login'; // Redirect to login if no token
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // Send the token for authentication
                    },
                    body: JSON.stringify({ fullName })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update profile.');
                }

                // Mark profile as completed in localStorage to avoid being sent back here
                localStorage.setItem('wopu_profile_completed', 'true');

                alert('Profile updated successfully!');
                window.location.hash = 'tasks'; // Redirect to the tasks view

            } catch (error) {
                console.error('Error updating profile:', error);
                alert(`Error: ${error.message}`);
            }
        });
    }
});