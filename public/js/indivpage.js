$(document).ready(function() {
    lightbox.option({
        'resizeDuration': 200,
        'wrapAround': true
    });
});


/* REVIEW FILTERS */

function showAllReviews() {
    const arrReviews = document.getElementsByClassName("review-positioner");
    for(i = 0; i < arrReviews.length; i++) {
        arrReviews[i].style.display = "flex";
    }
}

function showPhotoReviews() {
    const arrReviews = document.getElementsByClassName("review-positioner");
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

// Function to check if the text exceeds the word limit
function exceedsWordLimit(text, limit) {
    let words = text.split(/\s+/); // Split text into words based on spaces
    return words.length > limit;
}

document.addEventListener("DOMContentLoaded", function() {
    // Process each review
    document.querySelectorAll(".review-content").forEach(function(span) {
        let originalText = span.textContent.trim();

        if (exceedsWordLimit(originalText, 100)) { // If text exceeds 100 words
            let truncatedText = originalText.split(/\s+/).slice(0, 100).join(' ') + '...';
            
            // Set truncated text and append 'Read more' button
            span.innerHTML = truncatedText + ' <span class="untruncate-button">Read more</span>';
            
            // Store original text as a data attribute for easy access
            span.setAttribute('data-original-text', originalText);
        }
    });

    // Using event delegation for the buttons
    document.body.addEventListener("click", function(event) {
        // Check if clicked element is 'Read more' button
        if (event.target && event.target.className === "untruncate-button") {
            let span = event.target.closest('.review-content');
            let originalText = span.getAttribute('data-original-text');
            span.innerHTML = originalText + ' <span class="truncate-button">Read less</span>';
        }

        // Check if clicked element is 'Read less' button
        if (event.target && event.target.className === "truncate-button") {
            let span = event.target.closest('.review-content');
            let originalText = span.getAttribute('data-original-text');
            let truncatedText = originalText.split(/\s+/).slice(0, 100).join(' ') + '...';
            span.innerHTML = truncatedText + ' <span class="untruncate-button">Read more</span>';
        }
    });
});


/* PAGE BUTTONS */

function updateReviewDisplay(start, end) {
    const arrReviews = document.querySelectorAll(".review-positioner");
    arrReviews.forEach((review, reviewIndex) => {
        if (reviewIndex >= start && reviewIndex < end) {
            review.style.display = "flex";
        } else {
            review.style.display = "none";
        }
    });
}

function updatePageNumbers() {
    const arrReviews = document.querySelectorAll(".review-positioner");
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