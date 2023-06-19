$(document).ready(function() {
    // Switch to register form
    $('#registerLink').click(function() {
        $('#loginModal3').modal('hide');
        $('#registerModal3').modal('show');
    });

    // Switch to login form
    $('#loginLink').click(function() {
        $('#registerModal3').modal('hide');
        $('#loginModal3').modal('show');
    });

    $('#loginModal3').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#loginRememberMe').prop('checked', false);
    });
    
    $('#registerModal3').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    $('#loginBtn3').click(function() {
        var username = $('#loginUsername3').val();
        var password = $('#loginPassword3').val();

        if (username === 'abc' && password === '12345') {
            window.location.href = './userviews/profile.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    $('#signUpBtn').click(function() {
        var username = $('#registerUsername3').val();
        var password = $('#registerPassword3').val();
        
        if (username && password) {
            alert('Registration successful');
            
            $('#registerModal3').modal('hide');
            $('#loginModal3').modal('show');
        } else {
            alert('Please fill in all required fields.');
        }
    });
});
