function getCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = today.toLocaleDateString(undefined, options);
    
    return currentDate;
}


document.addEventListener('DOMContentLoaded', (event) => {
  // The DOM is fully loaded, we can add event listeners now.

  // Get all delete buttons
  const deleteButtons = document.querySelectorAll('.delete-button');

  // Loop through all delete buttons
  deleteButtons.forEach((deleteButton) => {
    // Attach click event to delete the feedback
    deleteButton.addEventListener('click', () => {
      // Get the feedback container that this button belongs to
      const feedbackContainer = deleteButton.closest('.feedback-positioner');
      // Remove this feedback container
      feedbackContainer.remove();
    });
  });
});


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
  feedbackContentSpan.classList.add("feedback-content");
  feedbackContentSpan.textContent = feedbackData.feedbackContent;

  // feedback content span to the feedback container
  feedbackContainer.appendChild(feedbackContentSpan);

  // feedback buttons container
  const feedbackButtonsContainer = document.createElement("div");
  feedbackButtonsContainer.classList.add("feedback-buttons-container");

  // Create edit button container div
  const editButtonContainer = document.createElement("div");
  editButtonContainer.classList.add("edit-button-container");

  // Create edit button
  const editButton = document.createElement("button");
  editButton.classList.add("edit-button");
  editButton.dataset.bsToggle = "modal";
  editButton.dataset.bsTarget = "#editFeedbackModal";

  editButton.addEventListener('click', () => {
    // Get corresponding feedback for this button
    activeFeedback = editButton.closest('.feedback-container').querySelector('.feedback-content');
    // Fill textarea with current feedback
    document.getElementById('editFeedbackContent').value = activeFeedback.textContent;
  });


  // Create edit button icon
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa", "fa-pencil-square-o");
  editIcon.setAttribute("aria-hidden", "true");

  // Append icon to the button, and the button to the edit button container
  editButton.appendChild(editIcon);
  editButtonContainer.appendChild(editButton);

  // Append edit button container to the feedback buttons container
  feedbackButtonsContainer.appendChild(editButtonContainer);

  // Create delete button container div
  const deleteButtonContainer = document.createElement("div");
  deleteButtonContainer.classList.add("delete-button-container");
  deleteButtonContainer.dataset.bsToggle = "modal";

  // Create delete button
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-button");

  deleteButton.addEventListener("click", function() {
    const feedbackContainer = deleteButton.closest('.feedback-positioner');
    feedbackContainer.remove();
  });

  // Create delete button icon
  const deleteIcon = document.createElement("i");
  deleteIcon.classList.add("fa", "fa-trash");
  deleteIcon.setAttribute("aria-hidden", "true");

  // Append icon to the button, and the button to the delete button container
  deleteButton.appendChild(deleteIcon);
  deleteButtonContainer.appendChild(deleteButton);

  // Append delete button container to the feedback buttons container
  feedbackButtonsContainer.appendChild(deleteButtonContainer);

  // Add the buttons container to the feedback container
  feedbackContainer.appendChild(feedbackButtonsContainer);

  // feedback-positioner container
  const feedbackPositioner = document.createElement("div");
  feedbackPositioner.classList.add("feedback-positioner");
  feedbackPositioner.appendChild(feedbackContainer);

  reviewContainer.appendChild(feedbackPositioner);
}



// Reference to the current review container
let currentReviewContainer = null;

// Event listener for reply buttons
document.querySelectorAll(".reply-button").forEach(function(replyButton) {
    replyButton.addEventListener("click", function(event) {
        event.preventDefault();
        // Set current review container
        currentReviewContainer = event.target.closest(".review-container");
    });
});

// Event listener for form submission
document.getElementById("feedbackForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitFeedback(currentReviewContainer);
});


function submitFeedback(reviewContainer) {
  const feedbackContent = document.getElementById("feedbackContent").value;
  const profileName = 'Your Profile Name'; // set your profile name
  const postDate = getCurrentDate();

  const feedbackData = {
      profileName,
      feedbackContent,
      postDate,
      profilePictureSrc: 'your_image_source'  // set photo here
  };

  addFeedback(feedbackData, reviewContainer);
  document.getElementById("feedbackForm").reset();

  var feedbackModal = bootstrap.Modal.getInstance(document.querySelector('#feedbackModal'));
  feedbackModal.hide();

}

// Initialize activeFeedback variable
let activeFeedback;

// Get all edit buttons
const editButtons = document.querySelectorAll('.edit-button');

// Loop through all edit buttons
editButtons.forEach((editButton) => {
  // Attach click event to open modal and fill textarea with current feedback
  editButton.addEventListener('click', () => {
    // Get corresponding feedback for this button
    activeFeedback = editButton.closest('.feedback-container').querySelector('.feedback-content');
    // Fill textarea with current feedback
    document.getElementById('editFeedbackContent').value = activeFeedback.textContent;
  });
});

// Function to handle editing feedback
function editFeedback(e) {
  // Prevent form from submitting normally
  e.preventDefault();

  // Get new feedback from textarea
  var newFeedback = document.getElementById('editFeedbackContent').value;

  if (newFeedback.trim() !== '') {
    // Update the feedback of the activeFeedback element
    activeFeedback.textContent = newFeedback;

    // Dismiss the modal
    var editFeedbackModal = bootstrap.Modal.getInstance(document.querySelector('#editFeedbackModal'));
    editFeedbackModal.hide();
  } else {
    alert("Feedback can't be empty");
  }
}

// Attach submit event to feedback edit form
document.getElementById('feedbackEditForm').addEventListener('submit', editFeedback);

// Reset the textarea when the modal hides
document.getElementById('editFeedbackModal').addEventListener('hidden.bs.modal', function () {
  document.getElementById('editFeedbackContent').value = '';
});





