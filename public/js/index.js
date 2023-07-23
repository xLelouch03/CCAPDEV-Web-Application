//import { connectToMongo, getDb } from "./src/db/conn.js";

$(document).ready(function() {
    // Switch to register form
    $('#registerLink').click(function() {
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
    });

    // Switch to login form
    $('#loginLink').click(function() {
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
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

    $('#loginBtn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
      
        var username = $('#loginUsername').val();
        var password = $('#loginPassword').val();
        window.location.href = '/loggedInMain';
        /*if (!username || !password) {
          alert('Please enter a valid username and password.');
          return;
        }
      
        $.ajax({
          url: '/login',
          method: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ username: username, password: password }),
          success: function(response) {
            console.log(response); // Handle the login response here
            if (response.message === 'Login successful') {
              // Redirect to the main view if login is successful
              window.location.href = '/loggedInMain';
            } else {
              alert('Invalid username or password. Please try again.');
            }
          },
          error: function(xhr, status, error) {
            console.error(xhr.responseText); // Handle login errors here
            alert('An error occurred. Please try again.');
          },
        });*/
      });
      
      

    // Sign up button click event
    $('#signUpBtn').click(function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
    
        var username = $('#registerUsername').val();
        var password = $('#registerPassword').val();
    
        if (username && password) {
          // Make a POST request to the server to register the user
          $.ajax({
            url: '/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username: username, password: password }),
            success: function(response) {
              console.log(response);
              alert('Registration successful');
              $('#registerModal').modal('hide');
              $('#loginModal').modal('show');
            },
            error: function(xhr, status, error) {
              console.error(xhr.responseText);
              alert('Failed to register user. Please try again.');
            },
          });
        } else {
          alert('Please fill in all required fields.');
        }
      });

    $('#logout').click(function() {
        // Redirect the user to the index page when the logout button is clicked
       window.location.href = '/';
    });
});
