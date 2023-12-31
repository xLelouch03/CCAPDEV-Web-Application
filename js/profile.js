// Get the reviews container
var reviewsContainer = document.querySelector(".reviews-container");

// Array of review file URLs
var reviewSource = [
  "baguio-country-club.html",
  "balesin-island-club.html",
  "manila-ocean-park.html",
  "masungi-georeserve.html",
  "the-manila-hotel.html"
];

// Array of user names and their respective reviews
var users = [
  {
    name: "David",
    reviews: []
  },
  {
    name: "Yna",
    reviews: []
  },
  {
    name: "Martin",
    reviews: []
  },
  {
    name: "Kieffer",
    reviews: []
  },
  {
    name: "Timothy",
    reviews: []
  }
];

// Fetch a review and process it
function fetchReviewSource(source) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", source, true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var tempContainer = document.createElement("div");
        tempContainer.innerHTML = xhr.responseText;
        var reviewContainers = tempContainer.querySelectorAll(".review-container, .text-only-review");
        var destinationName = tempContainer.querySelector("#page-header").textContent;
        resolve({ destinationName: destinationName, reviewContainers: reviewContainers });
      } else {
        reject(Error(xhr.statusText));
      }
    };
    xhr.onerror = function () {
      reject(Error("Network error"));
    };
    xhr.send();
  });
}

// Fetch and process reviews for the current user
function fetchReviewsForUser(user) {
  var fetchPromises = reviewSource.map(function (source) {
    return fetchReviewSource(source);
  });

  Promise.all(fetchPromises)
    .then(function (results) {
      results.forEach(function (result, index) {
        var reviewContainers = result.reviewContainers;
        var destinationName = result.destinationName;

        reviewContainers.forEach(function (reviewContainer) {
          var reviewUserName = reviewContainer.querySelector(".profile-name").textContent;
          if (reviewUserName === user.name) {
            if (!user.reviews[index]) {
              user.reviews[index] = {
                destinationName: destinationName,
                reviews: []
              };
            }
            // Remove feedback-positioner if it exists
            var feedbackPositioner = reviewContainer.querySelector(".feedback-positioner");
            if (feedbackPositioner) {
              feedbackPositioner.parentNode.removeChild(feedbackPositioner);
            }
            user.reviews[index].reviews.push(reviewContainer.innerHTML);
          }
        });
      });
    })
    .then(function () {
      displayReviewsForUser(user);
    })
    .catch(function (error) {
      console.error("Error fetching reviews:", error);
    });
}

// Display reviews for the current user
function displayReviewsForUser(user) {
  reviewsContainer.innerHTML = "";

  user.reviews.forEach(function (reviewData) {
    var destinationName = reviewData.destinationName;
    var reviews = reviewData.reviews;

    var destinationHeading = document.createElement("h3");
    destinationHeading.textContent = destinationName;
    reviewsContainer.appendChild(destinationHeading);

    var reviewElement = document.createElement("div");
    reviewElement.setAttribute("class", "review");

    reviews.forEach(function (review) {
      var reviewItem = document.createElement("div");
      var lineBreak = document.createElement("br");
      reviewElement.appendChild(lineBreak);
      reviewItem.innerHTML = review;
      reviewElement.appendChild(reviewItem);
    });

    // Add a line break between each review element
    var lineBreak = document.createElement("br");
    reviewElement.appendChild(lineBreak);

    reviewsContainer.appendChild(reviewElement);
  });
}

// Find the current user based on the profile index
var profileIndex = parseInt(window.location.href.match(/profile(\d+)\.html/)[1]) - 1;
console.log(profileIndex);
var currentUser = users[profileIndex];

// Fetch and display reviews for the current user
fetchReviewsForUser(currentUser);
displayReviewsForUser(currentUser);
