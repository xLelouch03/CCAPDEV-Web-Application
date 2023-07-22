function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString(undefined, options);
    
    return currentDate;
}

function addFeedback(feedbackData, reviewContainer) {
    const feedbackContainer = document.createElement("div");
    feedbackContainer.classList.add("feedback-container");
    

    // profile container
    const profileContainer = document.createElement("div");
    profileContainer.classList.add("profile-container");

    // profile picture img
    const profilePictureImg = document.createElement("img");
    profilePictureImg.classList.add("profile-picture");
    profilePictureImg.src = feedbackData.profilePictureSrc;
    profileContainer.appendChild(profilePictureImg);

    // post details container div
    const postDetailsContainer = document.createElement("div");
    postDetailsContainer.classList.add("post-details-container");

    // profile name span
    const profileNameSpan = document.createElement("span");
    profileNameSpan.classList.add("profile-name");
    profileNameSpan.textContent = feedbackData.profileName;
    postDetailsContainer.appendChild(profileNameSpan);

    // post date span
    const postDateSpan = document.createElement("span");
    postDateSpan.classList.add("post-date");
    postDateSpan.textContent = feedbackData.postDate;
    postDetailsContainer.appendChild(postDateSpan);

    // Add postDetailsContainer to the profile container
    profileContainer.appendChild(postDetailsContainer);

    feedbackContainer.appendChild(profileContainer);

    // feedback content span
    const feedbackContentSpan = document.createElement("span");
    feedbackContentSpan.classList.add("review-content");
    feedbackContentSpan.textContent = feedbackData.feedbackContent;

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
    const feedbackPositioner = document.getElementsByClassName("feedback-positioner")[0];
    feedbackPositioner.appendChild(feedbackContainer);

    const reviewsContainer = document.getElementsByClassName("reviews-cont")[0];
    reviewsContainer.appendChild(reviewContainer);

    reviewContainer.getElementsByClassName("feedback-positioner")[0].appendChild(feedbackContainer);
}

document.getElementById("feedbackForm").addEventListener("submit", function(event) {
  event.preventDefault();
  submitFeedback();
});

function submitFeedback() {
  const feedbackModal = document.getElementById("feedbackModal");
  const profileName = document.querySelector(".profile-name").textContent;
  const feedbackContent = document.querySelector("#reviewContent").value;
  const postDate = getCurrentDate();

  const feedbackData = {
    profileName,
    feedbackContent,
    postDate,
    profilePictureSrc: 'your_image_source'  // photo here
  };

  addFeedback(feedbackData);
  // Reset the form fields (optional)
  document.getElementById("feedbackForm").reset();
}
