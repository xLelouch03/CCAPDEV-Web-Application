/* REVIEW MODALS FUNCTIONALITY */

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