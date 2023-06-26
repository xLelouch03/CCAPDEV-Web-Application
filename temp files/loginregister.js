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

    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $(this).find('#rememberMe').prop('checked', false);
    });
    
    $('#registerModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    $('#loginBtn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();

        if (username === 'abc' && password === '12345') {
            window.location.href = './userviews/profile.html';
        } else {
            alert('Invalid username or password. Please try again.');
        }
    });

    $('#signUpBtn').click(function() {
        var username = $('#registerUsername').val();
        var password = $('#registerPassword').val();
        
        if (username  && password) {
            alert('Registration successful');
            
            $('#registerModal').modal('hide');
            $('#loginModal').modal('show');
        } else {
            alert('Please fill in all required fields.');
        }
    });

    //Search functionality
    $("#searchbar").on("input", function() {
        var input = $(this).val().toLowerCase();
        if (input.trim() === "") {
          $("#searchResultsDropdown").hide();
          return;
        }
      
        var dropdown = $("#searchResultsDropdown");
        dropdown.empty();
      
        $(".dropdown-menu li a").each(function() {
          var destinationName = $(this).text().toLowerCase();
          if (destinationName.includes(input)) {
            var item = $("<a>")
              .attr("href", $(this).attr("href"))
              .addClass("dropdown-item")
              .text($(this).text());
            dropdown.append(item);
          }
        });
      
        if (dropdown.children().length > 0) {
          dropdown.show();
        } else {
          dropdown.hide();
        }
      });
      
      // Hide dropdown when clicking outside
      $(document).click(function(e) {
        if (!$(e.target).closest(".search-container").length) {
          $("#searchResultsDropdown").hide();
        }
      });
});