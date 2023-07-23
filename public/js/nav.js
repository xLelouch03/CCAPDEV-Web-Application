$(document).ready(function() {
  $('#logout').click(function() {
    // Redirect the user to the index page when the logout button is clicked
    window.location.href = '/';
  });
});
    
const dropdownToggle = document.getElementById('profile-dropdown-toggle');
const dropdownMenu = document.getElementById('profile-dropdown-menu');

dropdownToggle.addEventListener('click', () => {
  dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
});