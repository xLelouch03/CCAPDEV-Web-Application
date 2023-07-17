$(document).ready(function() {
    // Switch to register form
    $('#registerLink').click(function() {
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });

    // Switch to login form
    $('#loginLink').click(function() {
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
    });

    // Clear input fields and checkboxes on modal close
    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $('#loginRememberMe').prop('checked', false);
    });

    $('#registerModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    // Login button click event
    $('#loginBtn').click(function() {
        var username = $('#loginUsername').val();
        var password = $('#loginPassword').val();
        window.location.href = 'static/userviews/main.html';
        // if (username === 'abc' && password === '12345') {
          //  window.location.href = './userviews/main.html';
        //} else {
          //  alert('Invalid username or password. Please try again.');
        //}
    });

    // Sign up button click event
    $('#signUpBtn').click(function() {
        var username = $('#registerUsername').val();
        var password = $('#registerPassword').val();

        if (username && password) {
            alert('Registration successful');
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        } else {
            alert('Please fill in all required fields.');
        }
    });
});
