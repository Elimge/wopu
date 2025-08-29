
/**
 * File: app/views/complete-profile.js
 * Description: Handles the complete profile form submission, simulates saving user data, and redirects to the tasks dashboard.
 */

console.log("Complete Profile script loaded.");

const profileForm = document.getElementById('complete-profile-form');

/**
 * Handles the complete profile form submission, simulates saving user data, and redirects to the tasks dashboard.
 * @param {Event} event - The form submit event
 */
profileForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const userProfile = {
        firstName: document.getElementById('first-name').value,
        lastName: document.getElementById('last-name').value,
        dob: document.getElementById('dob').value,
        personalGoal: document.getElementById('personal-goal').value,
        financialGoal: document.getElementById('financial-goal').value,
    };

    console.log("Profile data to save:", userProfile);

    // Simulate API call and save profile completion flag in localStorage
    localStorage.setItem('wopu_profile_completed', 'true');
    localStorage.setItem('wopu_user_profile', JSON.stringify(userProfile));

    // Redirect user to the tasks dashboard
    alert('Profile complete! Welcome to Wopu.');
    window.location.hash = 'tasks';
});