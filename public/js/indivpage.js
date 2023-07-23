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
        window.location.href = '../userviews/main.html';
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

function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString(undefined, options);
    
    return currentDate;
}

/* REVIEWS - RELATED */


function addReview(reviewData) {
        // review container div
        const reviewContainer = document.createElement("div");
        reviewContainer.classList.add("review-container");
      
        // profile container
        const profileContainer = document.createElement("div");
        profileContainer.classList.add("profile-container");

        // profile picture img
        const profilePictureImg = document.createElement("img");
        profilePictureImg.classList.add("profile-picture");
        profilePictureImg.src = reviewData.profilePictureSrc;
        profileContainer.appendChild(profilePictureImg);

        // post details container div
        const postDetailsContainer = document.createElement("div");
        postDetailsContainer.classList.add("post-details-container");

        // profile name container
        const profileNameSpan = document.createElement("span");
        profileNameSpan.classList.add("profile-name");

        // profile name link
        const profileNameLink = document.createElement("a");
        profileNameLink.href = reviewData.profileLink;
        profileNameLink.style.color = "black";
        profileNameLink.style.textDecoration = "none";
        profileNameLink.textContent = reviewData.profileName;

        // Add the link to the profileNameSpan
        profileNameSpan.appendChild(profileNameLink);

        // postDateSpan

        
        const postDateSpan = document.createElement("span");
        postDateSpan.classList.add("post-date");
        postDateSpan.textContent = reviewData.postDate; 

        // Add postDateSpan to the profileNameSpan
        profileNameSpan.appendChild(postDateSpan);

        // Add profileNameSpan to the postDetailsContainer
        postDetailsContainer.appendChild(profileNameSpan);

        // Add postDetailsContainer to the review container
        profileContainer.appendChild(postDetailsContainer);

        reviewContainer.appendChild(profileContainer);

      
        // review rating container div
        const reviewRatingContainer = document.createElement("div");
        reviewRatingContainer.classList.add("review-rating-container");
      
        // star icons based on the rating value
        for (let i = 0; i < reviewData.rating; i++) {
          const starIcon = document.createElement("i");
          starIcon.classList.add("fa", "fa-star", "review-star-icon");
          reviewRatingContainer.appendChild(starIcon);
        }
      
        // review rating container to the review container
        reviewContainer.appendChild(reviewRatingContainer);
      
        // review title span
        const reviewTitleSpan = document.createElement("span");
        reviewTitleSpan.classList.add("review-title");
        reviewTitleSpan.textContent = reviewData.reviewTitle;
      
        // eview title span to the review container
        reviewContainer.appendChild(reviewTitleSpan);
      
        
        // review content span
        const reviewContentSpan = document.createElement("span");
        reviewContentSpan.classList.add("review-content");
        reviewContentSpan.textContent = reviewData.reviewContent;
      
        // review content span to the review container
        reviewContainer.appendChild(reviewContentSpan);

        // photo album container div
        const photoAlbumContainer = document.createElement("div");
        photoAlbumContainer.classList.add("photo-album");

        // Add images from the reviewData.photoAlbum array (assuming it contains image URLs)
        for (const imageUrl of reviewData.photoAlbum) {
            const imageElement = document.createElement("img");
            imageElement.classList.add("photo-album-photo");
            imageElement.src = imageUrl;
            photoAlbumContainer.appendChild(imageElement);
        }

        // append photo album to the review container
        reviewContainer.appendChild(photoAlbumContainer);



        // helpful container div
        const helpfulContainer = document.createElement("div");
        helpfulContainer.classList.add("helpful-container");

        // helpful icon span
        const helpfulIcon = document.createElement("span");
        helpfulIcon.classList.add("helpful-icon");
        helpfulContainer.appendChild(helpfulIcon);

        // helpful text span
        const helpfulText = document.createElement("span");
        helpfulText.classList.add("helpful-text");
        helpfulText.textContent = `Helpful ${reviewData.helpfulCount}`;
        helpfulContainer.appendChild(helpfulText);

        // Add some space between helpful and unhelpful elements
        helpfulContainer.appendChild(document.createTextNode("\u00A0\u00A0\u00A0\u00A0\u00A0"));

        // unhelpful icon span
        const unhelpfulIcon = document.createElement("span");
        unhelpfulIcon.classList.add("unhelpful-icon");
        helpfulContainer.appendChild(unhelpfulIcon);

        // unhelpful text span
        const unhelpfulText = document.createElement("span");
        unhelpfulText.classList.add("helpful-text");
        unhelpfulText.textContent = `Unhelpful ${reviewData.unhelpfulCount}`;
        helpfulContainer.appendChild(unhelpfulText);

        // helpful container to the review container
        reviewContainer.appendChild(helpfulContainer);

        // review container to the all reviews container
        const reviewsContainer = document.getElementsByClassName("reviews-cont")[0];
        reviewsContainer.appendChild(reviewContainer);
      }

document.getElementById("reviewForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitReview();
});

function submitReview() {
    const reviewForm = document.getElementById("reviewForm");
  
    const profileName = document.querySelector(".profile-name a").textContent;
    const rating = Array.from(reviewForm.querySelectorAll(".reviewer-rating-star")).filter(star => star.classList.contains("reviewer-rating-selected")).length;
    const reviewTitle = reviewForm.querySelector("#reviewTitle").value;
    const reviewContent = reviewForm.querySelector("#reviewContent").value;
    const postDate = getCurrentDate();

    const fileInput = document.getElementById("reviewPhoto");

    const reviewData = {
      profileName,
      rating,
      reviewTitle,
      reviewContent,
      postDate,
      photoAlbum: [],
    };
  
    if (fileInput.files && fileInput.files.length > 0) {
        // Process each selected file (image)
        Array.from(fileInput.files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = function() {
                reviewData.photoAlbum.push(reader.result);
                if (reviewData.photoAlbum.length === fileInput.files.length) {
                    addReview(reviewData);
                    // Reset the file input field (optional)
                    fileInput.value = "";
                    reviewForm.reset();
                }
            };
            reader.readAsDataURL(file);
        });
    } else {
        addReview(reviewData);
        // Reset the file input field (optional)
        fileInput.value = "";
        reviewForm.reset();
    }
    updatePageNumbers();
    //closeModal();
  }
