$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });

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

    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#loginRememberMe').prop('checked', false);
    });
    
    $('#registerModal').on('hidden.bs.modal', function() {
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
            
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        } else {
            alert('Please fill in all required fields.');
        }
    });
});

function showAllReviews() {
    var x = document.getElementsByClassName("review-container");
    for(i = 0; i < x.length; i++) {
        x[i].style.display = "flex";
    }
}

function showPhotoReviews() {
    var x = document.getElementsByClassName("text-only-review");
    for(i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
}