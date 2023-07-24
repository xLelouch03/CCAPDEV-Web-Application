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
    // Extract the file name from the establishmentPhotos input field
    const establishmentPhotosInput = $('#establishmentPhotos')[0];
    const establishmentPhotosFileName = establishmentPhotosInput.files[0].name;
    requestData.establishmentPhotos = `static/images/${establishmentPhotosFileName}`;
  } else {
    // Extract the file name from the avatar input field
    const avatarInput = $('#avatar')[0];
    const avatarFileName = avatarInput.files[0].name;
    requestData.avatar = `static/images/${avatarFileName}`;
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

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    console.log('userId:', userId);
    
    // Fetch the user data based on the userId
    fetchUserData(userId)
      .then((userData) => {
        console.log('userData:', userData);
    
        // Create a Handlebars template (replace with your actual template)
        const templateSource = `
          <div class="profile-container2">
              <img src="${userData.avatar}" alt="Profile Picture" class="profile-picture2">
              <h4 class="name">${userData.username}</h4>
              <h6 class="description">${userData.profileDescription}</h6>
              <!-- Add more HTML elements to display user data as needed -->
              <ul class="nav flex-column nav-pills mt-3">
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="pill" href="#update-user-info">Update User Info</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="pill" href="#juanderlast-points">Juanderlast Points</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="pill" href="#promo-codes">Promo Codes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="pill" href="#reviews">Reviews</a>
                    </li>
                </ul>
            </div>
          </div>
        `;
    
        // Compile the Handlebars template
        const template = Handlebars.compile(templateSource);
    
        // Render the template with the userData and place it in the 'profile-container2' element
        const profileHtml = template(userData);
        $('.profile-container2').html(profileHtml);
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
