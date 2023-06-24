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

    $('#loginBtn').click(function() {
        var username = $('#loginUsername3').val();
        var password = $('#loginPassword3').val();

        if (username === 'abc' && password === '12345') {
            window.location.href = '../userviews/main.html';
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
    const arrReviews = document.getElementsByClassName("review-container");
    for(i = 0; i < arrReviews.length; i++) {
        arrReviews[i].style.display = "flex";
    }
}

function showPhotoReviews() {
    const arrReviews = document.getElementsByClassName("review-container");
    for(i = 0; i < arrReviews.length; i++) {
        arrReviews[i].style.display = "flex";
        if(arrReviews[i].classList.contains("text-only-review")) {
            arrReviews[i].style.display = "none";
        }
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

const arrPageButtons = document.querySelectorAll(".page-button");
arrPageButtons.forEach((pageButton, index) => {

    const arrReviews = document.querySelectorAll(".review-container");
    pageButton.addEventListener("click", () => {

        const selectedPage = document.querySelector(".page-button-selected");
        if(selectedPage) {
            selectedPage.classList.add("page-button");
            selectedPage.classList.remove("page-button-selected");
        }

        pageButton.classList.add("page-button-selected");
        pageButton.classList.remove("page-button");

        const reviewsPerPage = 2;
        const start = index * reviewsPerPage;
        const end = start + reviewsPerPage;

        arrReviews.forEach((review, reviewIndex) => {
            if (reviewIndex >= start && reviewIndex < end) {
                review.style.display = "flex";
            } else {
                review.style.display = "none";
            }
        });
    });
});

const arrReviewFilters = document.querySelectorAll(".review-filter");
arrReviewFilters.forEach(reviewFilter => {
    reviewFilter.addEventListener("click", () => {
        const selectedPage = document.querySelector(".page-button-selected");
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
    });
});

const showAllReviewsButton = document.querySelector("#all.review-filter");
const showPhotosOnlyButton = document.querySelector("#photos.review-filter");

showAllReviewsButton.addEventListener("click", () => {
    showPhotosOnlyButton.classList.remove("review-filter-selected");
    showPhotosOnlyButton.classList.add("review-filter");
    showAllReviewsButton.classList.remove("review-filter");
    showAllReviewsButton.classList.add("review-filter-selected");
});

showPhotosOnlyButton.addEventListener("click", () => {
    showAllReviewsButton.classList.remove("review-filter-selected");
    showAllReviewsButton.classList.add("review-filter");
    showPhotosOnlyButton.classList.remove("review-filter");
    showPhotosOnlyButton.classList.add("review-filter-selected");
});