$(document).ready(() => {
  // Update the profile dropdown options with fetched usernames
  function updateProfileDropdownOptions(users) {
    const userDropdownList = $("#userDropdownList");
    userDropdownList.empty();

    users.forEach((user) => {
      const userOption = $(`<li class="dropdown-item user-option" data-user-id="${user._id}">${user.username}</li>`);
      userDropdownList.append(userOption);
    });
  }

  // Fetch usernames from the server
  async function fetchUsernames() {
    try {
      const response = await fetch('/users'); // Make a GET request to your /users endpoint
      if (!response.ok) {
        throw new Error(`Error fetching usernames (Status: ${response.status})`);
      }
      const data = await response.json();
      return data.users; // Assuming the response contains the 'users' array with usernames
    } catch (error) {
      console.error('Error fetching usernames:', error);
      return []; // Return an empty array or handle the error accordingly
    }
  }

  // Fetch usernames and update the profile dropdown when the page loads
  fetchUsernames()
    .then((users) => {
      updateProfileDropdownOptions(users);
    })
    .catch((error) => {
      console.error("Error fetching usernames:", error);
      // Handle error if needed
    });

  // Event handler for profile dropdown selection
  const userDropdownList = $("#userDropdownList");
  userDropdownList.on("click", ".user-option", function () {
    const userId = $(this).data("user-id");
    // Implement your logic here to update the profile content based on the selected user (userId)
    // For example, call a function that fetches user and review data for the selected user
    // and then updates the profile content accordingly.
    // The fetchUserDataFromServer and fetchReviewDataFromServer functions can be reused for this purpose.

    console.log("Selected user ID:", userId);
  });

  // ... Rest of your code ...
});