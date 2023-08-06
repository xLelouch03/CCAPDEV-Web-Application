document.addEventListener('DOMContentLoaded', function() {
	// Get the button elements
	const replyButtons = document.querySelectorAll('.reply-button');
	const editButtons = document.querySelectorAll('.edit-button');
	const deleteButtons = document.querySelectorAll('.delete-button');

	// Attach a click event listener to each button
	replyButtons.forEach(button => {
		button.addEventListener('click', function() {
			// Store the button's value in the form's data attribute
			const form = document.querySelector('#feedbackForm');
			form.setAttribute('associated-review-id', this.value);
		});
	});
	editButtons.forEach(button => {
		button.addEventListener('click', function() {
			const form = document.querySelector('#editFeedbackForm');
			form.setAttribute('edit-reply-id', this.value);
		});
	});
	deleteButtons.forEach(button => {
		button.addEventListener('click', function() {
			const form = document.querySelector('#deleteFeedbackForm');
			form.setAttribute('delete-reply-id', this.value);
		});
	});
});

function submitFeedback() {
    const feedbackForm = document.getElementById("feedbackForm");
    const feedbackContent = feedbackForm.querySelector("#feedbackContent").value;
    const reviewId = feedbackForm.getAttribute("associated-review-id");
    const feedbackData = {
        reviewId: reviewId,
        body: feedbackContent
    };

    fetch(`${window.location.pathname}/reply`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
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

// Attach a 'submit' event listener to the add feedback form
const feedbackForm = document.getElementById("feedbackForm");
feedbackForm.addEventListener('submit', function(event) {
	event.preventDefault();
	submitFeedback();
});

// Function to handle editing feedback
function editFeedback() {
	const editFeedbackForm = document.getElementById("editFeedbackForm");
	const editFeedbackContent = editFeedbackForm.querySelector("#editFeedbackContent").value;
	const replyId = editFeedbackForm.getAttribute("edit-reply-id");
	const feedbackData = {
		replyId: replyId,
		body: editFeedbackContent
	};
	console.log(feedbackData);

	fetch(`${window.location.pathname}/reply`, {
		method: 'PUT', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(feedbackData)
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

// Attach a 'submit' event listener to the edit feedback form
const editFeedbackForm = document.getElementById("editFeedbackForm");
editFeedbackForm.addEventListener('submit', function(event) {
	event.preventDefault();
	console.log("Edit feedback form clicked!");
	editFeedback();
});

// Called when a delete button is clicked
function deleteFeedback() {
	const deleteFeedbackForm = document.getElementById("deleteFeedbackForm");
	const replyId = deleteFeedbackForm.getAttribute("delete-reply-id");
	const feedbackData = { replyId: replyId };
	console.log(feedbackData);

	fetch(`${window.location.pathname}/reply`, {
		method: 'DELETE', 
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(feedbackData)
	})
	.then(response => response.json())
	.then(data => {
		console.log(data);
		location.reload();
	})
		.catch((error) => console.error('Error:', error));
	}

	// Attach a 'submit' event listener to the delete feedback confirmation form
	const deleteFeedbackForm = document.getElementById('deleteFeedbackForm');
	deleteFeedbackForm.addEventListener('submit', function(event) {
	event.preventDefault();
	deleteFeedback();
});

// Reset the text fields when the pop-up modals hide
document.getElementById('editFeedbackModal').addEventListener('hidden.bs.modal', function () {
	document.getElementById('editFeedbackContent').value = '';
});

document.getElementById('feedbackModal').addEventListener('hidden.bs.modal', function () {
	document.getElementById('feedbackContent').value = '';
});