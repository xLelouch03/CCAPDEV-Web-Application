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

const arrStars = document.querySelectorAll(".reviewer-rating-star");
arrStars.forEach((star, index1) => {
    star.addEventListener("click", () => {
        arrStars.forEach((star, index2) => {
            if(index1 >= index2) {
                star.classList.add("reviewer-rating-selected");
                star.classList.remove("reviewer-rating-unselected");
            } else {
                star.classList.remove("reviewer-rating-selected");
                star.classList.add("reviewer-rating-unselected");
            }
        });
    });
});

const arrReviews = document.querySelectorAll(".review-container");
const arrPageButtons = document.querySelectorAll(".page-button");

arrPageButtons.forEach((pageButton, index) => {
    pageButton.addEventListener("click", () => {

        var selectedPage = document.querySelector(".page-button-selected");
        selectedPage.classList.add("page-button");
        selectedPage.classList.remove("page-button-selected");

        pageButton.classList.add("page-button-selected");
        pageButton.classList.remove("page-button");

        const reviewsPerPage = 2;
        for(i = (index * 2); i < (reviewsPerPage * (index + 1)); i++) {
            if(i < arrReviews.length) {
                arrReviews[i].style.display = "flex";
            }
        }
        arrReviews.forEach((review, reviewIndex) => {
            if((reviewIndex < index) || (reviewIndex >= (index + reviewsPerPage))) {
                review.style.display = "none";
            }
        });
    });
});