//import { connectToMongo, getDb } from "./src/db/conn.js";

$(document).ready(function() {
    // Switch to register form
    $('#registerLink').click(function() {
      $('#loginModal').modal('hide');
      $('#registerModal').modal('show');
      $('body').removeClass('modal-open'); // Remove the 'modal-open' class from the body
      $('.modal-backdrop').remove(); // Remove the modal backdrop
    });

    // Switch to login form
    $('#loginLink').click(function() {
      $('#registerModal').modal('hide');
      $('#loginModal').modal('show');
      $('body').removeClass('modal-open'); // Remove the 'modal-open' class from the body
      $('.modal-backdrop').remove(); // Remove the modal backdrop
    });


    // Clear input fields and checkboxes on modal close
    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $('#loginRememberMe').prop('checked', false);
    });

    $('#registerModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    // Show/hide the image upload field based on the selected role
    $('#role').on('change', function () {
      const selectedRole = $(this).val();
      if (selectedRole === 'owner') {
          $('.owner-only').show();
      } else {
          $('.owner-only').hide();
      }
  });


  $('#registerForm').on('submit', function (event) {
    event.preventDefault();

    // Get form input values
    const username = $('#registerUsername').val();
    const password = $('#registerPassword').val();
    const role = $('#role').val(); 
    const profileDescription = $('#description3').val();
    // Create the request data object
    const requestData = {
        username: username,
        password: password,
        role: role,
        profileDescription: profileDescription
    };

    // Add additional fields based on the role
    if (role === 'owner') {
        requestData.establishmentPhotos = $('#establishmentPhotos').val();
    } else {
        requestData.avatar = $('#avatar').val();
    }
    // Make the AJAX request
    $.ajax({
        type: 'POST',
        url: '/signup',
        data: JSON.stringify(requestData),
        contentType: 'application/json', // Set the content type to JSON
        success: function (response) {
          window.location.href = '/loggedInMain';
        },
        error: function (error) {
            console.error('Error registering user:', error.responseText);
        },
    });
});
  window.addEventListener("load", function (e) {
    const username = document.querySelector("#loginUsername");
    const password = document.querySelector("#loginPassword");
    const login = document.querySelector("#loginBtn");

    login?.addEventListener("click", async (e) => {
      e.preventDefault();

      const myObj = {
        username: username.value,
        password: password.value,
      };

      const jString = JSON.stringify(myObj);

      try {
        const response = await fetch("/login", {
          method: 'POST',
          body: jString,
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          // Login successful, redirect to the logged-in main page
          window.location.href = '/loggedInMain';
        } else {
          const data = await response.json(); // Parse the response body as JSON
          const message = data.message; // Access the "message" property
          alert("Login failed. " + message);
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred during login. Please try again later.");
      }
    });
});
  
  
    $('#logout').click(function() {
        // Redirect the user to the index page when the logout button is clicked
       window.location.href = '/';
    });


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
    async function fetchUserDataFromServer(userId) {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching user data (Status: ${response.status})`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Re-throw the error to handle it in the event handler
      }
    }

    // Function to fetch user data from the server based on userId
    async function fetchUserData(userId) {
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Error fetching user data (Status: ${response.status})`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }
    }

    // Get the userId from the query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Fetch the user data based on the userId
    fetchUserData(userId)
      .then((userData) => {
        // Assuming you are using Handlebars to render the profile template
        const profileTemplate = Handlebars.compile(/* Your Handlebars template */);
        const profileHtml = profileTemplate(userData);
        $('#profile-container').html(profileHtml); // Replace 'profile-container' with the ID of the container where you want to render the profile template
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        // Handle error if needed
      });
   
    const userDropdownList = $("#userDropdownList");
    userDropdownList.on("click", ".user-option", function () {
      const userId = $(this).data("user-id");
    
      // Redirect to the profile page with the selected user ID
      window.location.href = `/profile?userId=${userId}`;
    });
});
