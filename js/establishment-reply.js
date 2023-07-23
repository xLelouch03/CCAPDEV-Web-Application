function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString(undefined, options);
    
    return currentDate;
}

function addFeedback(reviewContainer, feedbackData) {
  const feedbackArray = Array.isArray(feedbackData) ? feedbackData : [feedbackData];
  let feedbackPositioner = reviewContainer.querySelector(".feedback-positioner");

  if (!feedbackPositioner) {
    // Create and append the .feedback-positioner element if it doesn't exist
    feedbackPositioner = document.createElement("div");
    feedbackPositioner.classList.add("feedback-positioner");
    reviewContainer.appendChild(feedbackPositioner);
  }

  for (const feedback of feedbackArray) {
    const feedbackContainer = document.createElement("div");
    feedbackContainer.classList.add("feedback-container");

      // profile container
      const profileContainer = document.createElement("div");
      profileContainer.classList.add("profile-container");

      // profile picture img
      const profilePictureImg = document.createElement("img");
      profilePictureImg.classList.add("profile-picture");
      profilePictureImg.src = feedback.profilePictureSrc;
      profileContainer.appendChild(profilePictureImg);

      // post details container div
      const postDetailsContainer = document.createElement("div");
      postDetailsContainer.classList.add("post-details-container");

      // profile name span
      const profileNameSpan = document.createElement("span");
      profileNameSpan.classList.add("profile-name");
      profileNameSpan.textContent = feedback.profileName;
      postDetailsContainer.appendChild(profileNameSpan);

      // post date span
      const postDateSpan = document.createElement("span");
      postDateSpan.classList.add("post-date");
      postDateSpan.textContent = feedback.postDate;
      postDetailsContainer.appendChild(postDateSpan);

      // Add postDetailsContainer to the profile container
      profileContainer.appendChild(postDetailsContainer);

      feedbackContainer.appendChild(profileContainer);

      // feedback content span
      const feedbackContentSpan = document.createElement("span");
      feedbackContentSpan.classList.add("review-content");
      feedbackContentSpan.textContent = feedback.feedbackContent;

      // feedback content span to the feedback container
      feedbackContainer.appendChild(feedbackContentSpan);

      // Create edit button container div
      const editButtonContainer = document.createElement("div");
      editButtonContainer.classList.add("edit-button-container");

      // Create edit button
      const editButton = document.createElement("button");
      editButton.classList.add("edit-button");
      editButton.dataset.bsToggle = "modal";
      editButton.dataset.bsTarget = "#editFeedbackModal";

      // Create edit button icon
      const editIcon = document.createElement("i");
      editIcon.classList.add("fa", "fa-pencil-square-o");
      editIcon.setAttribute("aria-hidden", "true");

      // Append icon to the button, and the button to the edit button container
      editButton.appendChild(editIcon);
      editButtonContainer.appendChild(editButton);

      // Append edit button container to the feedback container
      feedbackContainer.appendChild(editButtonContainer);

      // feedback container to the feedback positioner
      feedbackPositioner.appendChild(feedbackContainer);
    }
  }



document.getElementById("feedbackModal").addEventListener("submit", function(event) {
  event.preventDefault();
  submitFeedback();
});

function submitFeedback(buttonElement) {
  const reviewId = buttonElement.getAttribute("data-review-id");
  const feedbackModal = document.getElementById("feedbackModal");
  const profileName = buttonElement.closest(".review-container").querySelector(".profile-name").textContent;
  const feedbackContent = document.querySelector("#reviewContent").value;
  const postDate = getCurrentDate();

  const feedbackData = {
    profileName,
    feedbackContent,
    postDate,
    profilePictureSrc: 'your_image_source'  // photo here
  };

  const targetReviewContainer = document.getElementById(reviewId);

  if (targetReviewContainer) {
    const feedbackPositioner = targetReviewContainer.querySelector(".feedback-positioner");
    addFeedback(feedbackPositioner, feedbackData);
  }
}

function clearFeedbackForm() {
  const feedbackForm = document.getElementById("feedbackModal");
  const inputFields = feedbackForm.querySelectorAll("input, textarea");

  inputFields.forEach((input) => {
    input.value = "";
  });
}

// Add event listener to the feedback modal
document.getElementById("feedbackModal").addEventListener("hidden.bs.modal", clearFeedbackForm);