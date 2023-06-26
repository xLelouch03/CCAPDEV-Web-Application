$(document).ready(function() {
    $('#logout').click(function() {
        window.location.href = '../index.html';
    });            
});
    
const dropdownToggle = document.getElementById('profile-dropdown-toggle');
const dropdownMenu = document.getElementById('profile-dropdown-menu');

dropdownToggle.addEventListener('click', () => {
  dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
});