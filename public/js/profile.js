document.addEventListener("DOMContentLoaded", () => {
  const updateForm = document.getElementById("updateForm");
  const updateSuccessMessage = document.getElementById("updateSuccessMessage");

  updateForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Create a new FormData object
    const formData = new FormData(updateForm);

    // Get form input values
    const newUsername = formData.get("newUserName"); // Use "newUsername" here instead of "userName"
    const avatar = formData.get("profilePicture");
    const profileDescription = formData.get("userDescription");

    // Create the request payload using FormData
    const payload = {
      newUsername,
      avatar,
      profileDescription,
    };

    try {
      // Send the data to the server using AJAX
      const response = await fetch('/api/users/update', {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      console.log("Payload:", payload);
      if (response.ok) {
        // Display success message and update user data on the page
        updateSuccessMessage.style.display = "block";
        // Update any relevant elements on the page with the new user data
        document.getElementById("profilePictureDisplay").src = data.avatar;
        document.getElementById("userName").value = data.username;
        document.getElementById("userDescription").value = data.profileDescription;
      } else {
        // Handle error scenarios here
        console.error(data.message);
      }
    } catch (error) {
      // Handle network errors here
      console.error("Error:", error);
    }
  });
});
