$(document).ready(function() {
    $('#logout').click(function() {
        window.location.href = '../index.html';
    });

});

const destinations = [
    "Manila Ocean Park",
    "Masungi Georeserve",
    "Baguio Country Club",
    "The Manila Hotel",
    "Balesin Island Club"
];

function handleSearch(event) {
    const searchQuery = event.target.value.toLowerCase();
    const matchingDestinations = destinations.filter(destination => destination.toLowerCase().includes(searchQuery));

    // Clear previous results
    const searchResultsDropdown = document.getElementById("searchResultsDropdown");
    searchResultsDropdown.innerHTML = "";

    // Display matching destination results
    matchingDestinations.forEach(destination => {
        const dropdownItem = document.createElement("li");
        dropdownItem.innerHTML = `<a class="dropdown-item" href="#">${destination}</a>`;
        dropdownItem.addEventListener("click", function () {
            searchbar.value = destination;
        });
        searchResultsDropdown.appendChild(dropdownItem);
    });

    // Hide or show the search results dropdown based on matching results
    searchResultsDropdown.style.display = matchingDestinations.length > 0 ? "block" : "none";
}

// Attach event listeners
const searchbar = document.getElementById("searchbar");
searchbar.addEventListener("input", handleSearch);

// Hide the search results dropdown when clicking outside of it
document.addEventListener("click", function (event) {
    if (!searchResultsDropdown.contains(event.target)) {
        searchResultsDropdown.style.display = "none";
    }
});