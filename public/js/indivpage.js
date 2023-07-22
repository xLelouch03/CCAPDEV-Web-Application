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

/* REVIEW FILTERS */

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

const arrReviewFilters = document.querySelectorAll(".review-filter");
arrReviewFilters.forEach(reviewFilter => {
    reviewFilter.addEventListener("click", () => {
        const selectedPage = document.querySelector(".page-button-selected");
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
    });
});

/* TRUNCATE/UNTRUNCATE REVIEW */

const arrUntruncateButtons = document.querySelectorAll(".untruncate-button");
arrUntruncateButtons.forEach(untruncateButton => {
    untruncateButton.addEventListener("click", () => {
        untruncateButton.parentElement.style.display = "none";
        untruncateButton.parentElement.nextElementSibling.style.display = "block";
    });
});

const arrTruncateButtons = document.querySelectorAll(".truncate-button");
arrTruncateButtons.forEach(truncateButton => {
    truncateButton.addEventListener("click", () => {
        truncateButton.parentElement.style.display = "none";
        truncateButton.parentElement.previousElementSibling.style.display = "block";
    });
});

/* PAGE BUTTONS */

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

const previousPageButton = document.querySelector(".page-previous-button");
previousPageButton.addEventListener("click", () => {
    const selectedPage = document.querySelector(".page-button-selected");
    const previousPage = selectedPage.previousElementSibling;

    if(previousPage.classList.contains("page-button")) {
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
        previousPage.classList.remove("page-button");
        previousPage.classList.add("page-button-selected");

        const arrReviews = document.querySelectorAll(".review-container");
        arrPageButtons.forEach((pageButton, index) => {
            if(pageButton === previousPage) {
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
            }
        });
    }
});

const nextPageButton = document.querySelector(".page-next-button");
nextPageButton.addEventListener("click", () => {
    const selectedPage = document.querySelector(".page-button-selected");
    const nextPage = selectedPage.nextElementSibling;

    if(nextPage.classList.contains("page-button")) {
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
        nextPage.classList.remove("page-button");
        nextPage.classList.add("page-button-selected");

        const arrReviews = document.querySelectorAll(".review-container");
        arrPageButtons.forEach((pageButton, index) => {
            if(pageButton === nextPage) {
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
            }
        });
    }
});

/* HELPFUL BUTTONS */

const arrHelpfulButtons = document.querySelectorAll(".helpful-icon");
const arrUnhelpfulButtons = document.querySelectorAll(".unhelpful-icon");

if(arrHelpfulButtons) {
    arrHelpfulButtons.forEach(helpfulButton => {
        helpfulButton.addEventListener("click", () => {
            helpfulButton.classList.remove("helpful-icon");
            helpfulButton.classList.add("helpful-icon-selected");
            helpfulButton.nextElementSibling.nextElementSibling.nextElementSibling.classList.remove("unhelpful-icon-selected");
            helpfulButton.nextElementSibling.nextElementSibling.nextElementSibling.classList.add("unhelpful-icon");
        });
    });
}

if(arrUnhelpfulButtons) {
    arrUnhelpfulButtons.forEach(unhelpfulButton => {
        unhelpfulButton.addEventListener("click", () => {
            unhelpfulButton.classList.remove("unhelpful-icon");
            unhelpfulButton.classList.add("unhelpful-icon-selected");
            unhelpfulButton.previousElementSibling.previousElementSibling.previousElementSibling.classList.remove("helpful-icon-selected");
            unhelpfulButton.previousElementSibling.previousElementSibling.previousElementSibling.classList.add("helpful-icon");
        });
    });
}

/* REVIEW MODAL */

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