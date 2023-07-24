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
});
