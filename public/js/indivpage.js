$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
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

/*const arrPageButtons = document.querySelectorAll(".page-button");
arrPageButtons.forEach((pageButton, index) => {

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

        const arrReviews = document.querySelectorAll(".review-container");
        arrReviews.forEach((review, reviewIndex) => {
            if (reviewIndex >= start && reviewIndex < end) {
                review.style.display = "flex";
            } else {
                review.style.display = "none";
            }
        });
    });
});*/
/* PAGE BUTTONS */

function updateReviewDisplay(start, end) {
    const arrReviews = document.querySelectorAll(".review-container");
    arrReviews.forEach((review, reviewIndex) => {
        if (reviewIndex >= start && reviewIndex < end) {
            review.style.display = "flex";
        } else {
            review.style.display = "none";
        }
    });
}

function updatePageNumbers() {
    const arrReviews = document.querySelectorAll(".review-container");
    const reviewsPerPage = 2;
    const totalPages = Math.ceil(arrReviews.length / reviewsPerPage);

    const pageNumbersContainer = document.querySelector(".page-numbers-container");
    pageNumbersContainer.innerHTML = ""; // Clear existing page numbers

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.classList.add("page-button");
        pageButton.textContent = i;
        pageNumbersContainer.appendChild(pageButton);

        pageButton.addEventListener("click", () => {
            const selectedPage = document.querySelector(".page-button-selected");
            if (selectedPage) {
                selectedPage.classList.add("page-button");
                selectedPage.classList.remove("page-button-selected");
            }

            pageButton.classList.add("page-button-selected");
            pageButton.classList.remove("page-button");

            const start = (i - 1) * reviewsPerPage;
            const end = start + reviewsPerPage;

            updateReviewDisplay(start, end);
        });
    }

    // Select page 1 by default
    if (totalPages > 0) {
        const firstPageButton = document.querySelector(".page-button");
        firstPageButton.click();
    }
}

// Call this function whenever you add new reviews, for example, after fetching them from an API or adding them dynamically.
// You can also call it once at the beginning if you have some reviews already loaded.
updatePageNumbers();

const previousPageButton = document.querySelector(".page-previous-button");
previousPageButton.addEventListener("click", () => {
    const selectedPage = document.querySelector(".page-button-selected");
    const previousPage = selectedPage.previousElementSibling;

    if (previousPage && previousPage.classList.contains("page-button")) {
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
        previousPage.classList.remove("page-button");
        previousPage.classList.add("page-button-selected");

        const arrReviews = document.querySelectorAll(".review-container");
        const index = parseInt(previousPage.textContent) - 1;
        const reviewsPerPage = 2;
        const start = index * reviewsPerPage;
        const end = start + reviewsPerPage;

        updateReviewDisplay(start, end);
    }
});

const nextPageButton = document.querySelector(".page-next-button");
nextPageButton.addEventListener("click", () => {
    const selectedPage = document.querySelector(".page-button-selected");
    const nextPage = selectedPage.nextElementSibling;

    if (nextPage && nextPage.classList.contains("page-button")) {
        selectedPage.classList.remove("page-button-selected");
        selectedPage.classList.add("page-button");
        nextPage.classList.remove("page-button");
        nextPage.classList.add("page-button-selected");

        const arrReviews = document.querySelectorAll(".review-container");
        const index = parseInt(nextPage.textContent) - 1;
        const reviewsPerPage = 2;
        const start = index * reviewsPerPage;
        const end = start + reviewsPerPage;

        updateReviewDisplay(start, end);
    }
});



/* HELPFUL BUTTONS */

const arrHelpfulButtons = document.querySelectorAll(".helpful-icon");
const arrUnhelpfulButtons = document.querySelectorAll(".unhelpful-icon");

arrHelpfulButtons.forEach(helpfulButton => {
  helpfulButton.addEventListener("click", () => {
    const unhelpfulButton = helpfulButton.nextElementSibling.nextElementSibling.nextElementSibling;
    const helpfulCountElement = helpfulButton.nextElementSibling.querySelector('.helpful-count');
    const unhelpfulCountElement = unhelpfulButton.nextElementSibling.querySelector('.unhelpful-count');
    
    if (helpfulButton.classList.contains("helpful-icon-selected")) {
      helpfulButton.classList.remove("helpful-icon-selected");
      updateCount(helpfulCountElement, -1);
    } else {
      if (unhelpfulButton.classList.contains("unhelpful-icon-selected")) {
        unhelpfulButton.classList.remove("unhelpful-icon-selected");
        updateCount(unhelpfulCountElement, -1);
      }
      helpfulButton.classList.add("helpful-icon-selected");
      updateCount(helpfulCountElement, 1);
    }
  });
});

arrUnhelpfulButtons.forEach(unhelpfulButton => {
  unhelpfulButton.addEventListener("click", () => {
    const helpfulButton = unhelpfulButton.previousElementSibling.previousElementSibling.previousElementSibling;
    const helpfulCountElement = helpfulButton.nextElementSibling.querySelector('.helpful-count');
    const unhelpfulCountElement = unhelpfulButton.nextElementSibling.querySelector('.unhelpful-count');
    
    if (unhelpfulButton.classList.contains("unhelpful-icon-selected")) {
      unhelpfulButton.classList.remove("unhelpful-icon-selected");
      updateCount(unhelpfulCountElement, -1);
    } else {
      if (helpfulButton.classList.contains("helpful-icon-selected")) {
        helpfulButton.classList.remove("helpful-icon-selected");
        updateCount(helpfulCountElement, -1);
      }
      unhelpfulButton.classList.add("unhelpful-icon-selected");
      updateCount(unhelpfulCountElement, 1);
    }
  });
});

function updateCount(countElement, value) {
  const currentValue = parseInt(countElement.textContent);
  countElement.textContent = currentValue + value;
}

function updateCount(countElement, increment) {
  let count = parseInt(countElement.textContent);
  count += increment;
  countElement.textContent = count;
}

/* REVIEW MODAL */

document.addEventListener('DOMContentLoaded', function() {
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
});

function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString(undefined, options);
    
    return currentDate;
}

function submitReview() {
    const reviewForm = document.getElementById("reviewForm");
  
    const rating = Array.from(reviewForm.querySelectorAll(".reviewer-rating-star")).filter(star => star.classList.contains("reviewer-rating-selected")).length;
    const reviewTitle = reviewForm.querySelector("#reviewTitle").value;
    const reviewContent = reviewForm.querySelector("#reviewContent").value;

    const fileInput = document.getElementById("reviewPhoto");

    const reviewData = {
        rating: rating,
        title: reviewTitle,
        body: reviewContent,
        images: [],
    };

    const files = fileInput.files && fileInput.files.length > 0 ? Array.from(fileInput.files) : [];

    const filePromises = files.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = function() {
                reviewData.images.push(reader.result);
                resolve();
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    });

    Promise.all(filePromises)
    .then(() => {
        return fetch(`${window.location.pathname}/review`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Attach a 'submit' event listener to the add review form
const reviewForm = document.getElementById("reviewForm");
reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();
    submitReview();
});

// Function to handle editing feedback
function editReview() {

    // Get values from form
    var newReview = document.getElementById('editReviewContent').value;
    var newTitle = document.getElementById('editReviewTitle').value;

    const reviewData = {
        title: newTitle,
        body: newReview,
    };

    // Send the update to the server
    fetch(`${window.location.pathname}/review`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch((error) => console.error('Error:', error));
}

// Attach a 'submit' event listener to the edit review form
const reviewEditForm = document.getElementById('reviewEditForm');
reviewEditForm.addEventListener('submit', function(event) {
    event.preventDefault();
    editReview();
});

// Called when a delete button is clicked
function deleteReview() {
    fetch(`${window.location.pathname}/review`, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        location.reload();
    })
    .catch((error) => console.error('Error:', error));
}

// Attach a 'submit' event listener to the delete review confirmation form
const reviewDeleteForm = document.getElementById('reviewDeleteForm');
reviewDeleteForm.addEventListener('submit', function(event) {
    event.preventDefault();
    deleteReview();
});

// Reset the text fields when the pop-up modals hide
document.getElementById('editReviewModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('editReviewTitle').value = '';
    document.getElementById('editReviewContent').value = '';
});

document.getElementById('reviewModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById('reviewTitle').value = '';
    document.getElementById('reviewContent').value = '';
});

// Initialize activeFeedback variable
let activeReview;
let activeTitle;

// Attach click event to the reviews container instead of individual buttons
document.querySelector(".reviews-cont").addEventListener('click', function(event) {
    // Check whether the clicked element is an edit button
    if (event.target.closest('.edit-button')) {
      activeReview = event.target.closest('.review-container').querySelector('.review-content');
      activeTitle= event.target.closest('.review-container').querySelector('.review-title');
      document.getElementById('editReviewContent').value = activeReview.textContent;
      document.getElementById('editReviewTitle').value = activeTitle.textContent;
    }
});



