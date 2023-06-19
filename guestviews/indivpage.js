$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

    $('#registerLink2').click(function() {
        $('#loginModal2').modal('hide');
        $('#registerModal2').modal('show');
    });

    // Switch to login form
    $('#loginLink2').click(function() {
        $('#registerModal').modal('hide');
        $('#loginModal2').modal('show');
    });

    $('#loginModal2').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#rememberMe2').prop('checked', false);
    });
    
    $('#registerModal2').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    $('#loginBtn2').click(function() {
        var username = $('#username2').val();
        var password = $('#password2').val();

        if (username === 'abc' && password === '12345') {
            window.location.href = '../index.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    $('#signUpBtn2').click(function() {
        var username = $('#registerUsername2').val();
        var password = $('#registerPassword2').val();
        
        if (username  && password) {
            alert('Registration successful');
            
            $('#registerModal2').modal('hide');
            $('#loginModal2').modal('show');
        } else {
            alert('Please fill in all required fields.');
        }
    });

});