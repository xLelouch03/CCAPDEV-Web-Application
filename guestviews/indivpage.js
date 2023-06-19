$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

    $('#loginLink').click(function() {
        $('#loginModal').modal('show');
    });;
    
    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#rememberMe').prop('checked', false);
    });

    $('#loginBtn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        if (username === 'abc' && password === '12345') {
            window.location.href = '../userviews/profile.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    
});