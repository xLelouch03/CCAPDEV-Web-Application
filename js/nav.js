$(document).ready(function() {
    $('#logout').click(function() {
        window.location.href = '/index.html';
    });
    
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
    
const dropdownToggle = document.getElementById('profile-dropdown-toggle');
const dropdownMenu = document.getElementById('profile-dropdown-menu');

dropdownToggle.addEventListener('click', () => {
  dropdownMenu.style.display = (dropdownMenu.style.display === 'block') ? 'none' : 'block';
});