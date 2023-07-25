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
    // Event listener for role select element
    $('#role').on('change', function () {
      const selectedRole = $(this).val();
      const ownerOnlyFields = $('.owner-only');

      // Hide all owner-only fields
      ownerOnlyFields.hide();

      // If role is "owner," show the owner-only fields; otherwise, show the user fields
      if (selectedRole === 'owner') {
        ownerOnlyFields.show();
        $('#description3').hide();
      } else {
        $('#description3').show();
      }
    });


  // Function to handle image file upload and create a copy in the 'static/images' folder
function handleImageUpload(imageInput, fileName) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const imgData = event.target.result;
    // Create an anchor element with the image data and download it to save the image
    const a = document.createElement('a');
    a.href = imgData;
    a.download = fileName;
    a.click();
  };
  reader.readAsDataURL(imageInput.files[0]);
}

$('#registerForm').on('submit', function (event) {
  event.preventDefault();

  // Get form input values
  const role = $('#role').val();
  const username = $('#registerUsername').val();
  const password = $('#registerPassword').val();
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
    requestData.name = $('#establishmentName').val();
    requestData.description = $('#description').val();
    requestData.category = $('#category').val();
    requestData.location = $('#location').val();

    // Extract the file name from the establishmentPhotos input field
    const establishmentPhotosInput = $('#establishmentPhotos')[0];
    const establishmentPhotosFileName = establishmentPhotosInput.files[0].name;
    requestData.establishmentPhotos = `static/images/${establishmentPhotosFileName}`;

    // Call the function to handle image upload and create a copy in the 'static/images' folder
    handleImageUpload(establishmentPhotosInput, establishmentPhotosFileName);
  } else {
    // Extract the file name from the avatar input field
    const avatarInput = $('#avatar')[0];
    const avatarFileName = avatarInput.files[0].name;
    requestData.avatar = `static/images/${avatarFileName}`;

    // Call the function to handle image upload and create a copy in the 'static/images' folder
    handleImageUpload(avatarInput, avatarFileName);
  }
  
  // Determine the correct route based on the role
  const signupRoute = role === 'owner' ? '/signup-owner' : '/signup';

  // Make the AJAX request
  $.ajax({
    type: 'POST',
    url: signupRoute,
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
      const role = document.querySelector("#loginRole"); // Add role select element
      const login = document.querySelector("#loginBtn");

      login?.addEventListener("click", async (e) => {
        e.preventDefault();

        const loginData = {
          username: username.value,
          password: password.value,
          role: role.value // Get the selected role value
        };

        try {
          let loginRoute = "/login"; // Default login route for users

        if (loginData.role === "owner") {
          loginRoute = "/login-owner"; // Use login-owner route for owners
        }

        const response = await fetch(loginRoute, {
          method: 'POST',
          body: JSON.stringify(loginData),
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

  function updateEstablishmentDropdownOptions(establishments) {
    const establishmentDropdownList = $("#establishmentDropdownList");
    establishmentDropdownList.empty();
  
    establishments.forEach((establishment) => {
      const establishmentOption = $(`<li class="dropdown-item establishment-option" data-establishment-id="${establishment._id}">${establishment.name}</li>`);
      establishmentDropdownList.append(establishmentOption);
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

  async function fetchEstablishmentNames() {
    try {
      const response = await fetch('/establishments'); // Make a GET request to your /establishments endpoint
      if (!response.ok) {
        throw new Error(`Error fetching establishment names (Status: ${response.status})`);
      }
      const data = await response.json();
      return data.establishments; // Assuming the response contains the 'establishments' array with establishment names
    } catch (error) {
      console.error('Error fetching establishment names:', error);
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

  fetchEstablishmentNames()
    .then((establishments) => {
      updateEstablishmentDropdownOptions(establishments);
    })
    .catch((error) => {
      console.error("Error fetching establishment names:", error);
      // Handle error if needed
    });

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

    async function fetchEstablishmentData(establishmentId) {
      try {
        const response = await fetch(`/api/establishments/${establishmentId}`);
        if (!response.ok) {
          throw new Error(`Error fetching establishment data (Status: ${response.status})`);
        }
        return response.json();
      } catch (error) {
        console.error('Error fetching establishment data:', error);
        throw error;
      }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const establishmentId = urlParams.get('establishmentId');
    console.log('userId:', userId);
    console.log('establishmentId:', establishmentId);
    
    fetchEstablishmentData(establishmentId)
    .then((establishmentData) => {
      console.log('establishmentData:', establishmentData);

      // Create a Handlebars template (replace with your actual template)
      const templateSource2 = `
        <div class="profile-container2">
          <img src="${establishmentData.avatar}" alt="Establishment Avatar" class="profile-picture2">
          <h4 class="name">${establishmentData.name}</h4>
          <h6 class="description">${establishmentData.shortDescription}</h6>
          <!-- Add more HTML elements to display establishment data as needed -->
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
      const template2 = Handlebars.compile(templateSource2);

      // Render the template with the establishmentData and place it in the 'profile-container2' element
      const establishmentHtml = template2(establishmentData);
      $('.profile-container2').html(establishmentHtml);
    })
    .catch((error) => {
      console.error('Error fetching establishment data:', error);
      // Handle error if needed
    });
    
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

    const establishmentDropdownList = $("#establishmentDropdownList");
    establishmentDropdownList.on("click", ".establishment-option", function () {
    const establishmentId = $(this).data("establishment-id");
    window.location.href = `/profile?establishmentId=${establishmentId}`;

  }); 
});

async function updateUserDetails(username, updatedData) {
  try {
    const response = await fetch(`/api/users/${username}`, { // Replace :username with the actual username value
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error updating user details (Status: ${response.status})`);
    }

    return response.json();
  } catch (error) {
    console.error('Error updating user details:', error);
    throw error;
  }
}

// Event handler for form submission
$('#updateForm').on('submit', async function (event) {
  event.preventDefault();

  // Get updated form input values
  const username = $('#userName').val();
  const avatar = $('#profilePicture').val(); // Replace with the actual way to get the file value
  const profileDescription = $('#userDescription').val();

  // Create the updated data object to be sent to the server
  const updatedData = {
    newUsername: username,
    avatar: avatar,
    profileDescription: profileDescription,
  };

  try {
    // Update the user's details on the server
    const updatedUser = await updateUserDetails(username, updatedData);

    // Display success message and update profileData with the updated details
    $('#updateSuccessMessage').show();
    profileData = updatedUser;
  } catch (error) {
    console.error('Error updating user details:', error);
    // Handle error if needed
  }
});