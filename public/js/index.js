/*

$(document).ready(function() {

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
      const response = await fetch('/users'); 
      if (!response.ok) {
        throw new Error(`Error fetching usernames (Status: ${response.status})`);
      }
      const data = await response.json();
      return data.users; 
    } catch (error) {
      console.error('Error fetching usernames:', error);
      return []; 
    }
  }

  async function fetchEstablishmentNames() {
    try {
      const response = await fetch('/establishments'); // Make a GET request to your /establishments endpoint
      if (!response.ok) {
        throw new Error(`Error fetching establishment names (Status: ${response.status})`);
      }
      const data = await response.json();
      return data.establishments; 
    } catch (error) {
      console.error('Error fetching establishment names:', error);
      return []; 
    }
  }

  // Fetch usernames and update the profile dropdown when the page loads
  fetchUsernames()
      .then((users) => {
        updateProfileDropdownOptions(users);
      })
      .catch((error) => {
        console.error("Error fetching usernames:", error);
        
      });

  fetchEstablishmentNames()
      .then((establishments) => {
        updateEstablishmentDropdownOptions(establishments);
      })
      .catch((error) => {
        console.error("Error fetching establishment names:", error);
        
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

    async function fetchReviews(userId, establishmentId) {
      try {
          let response;
          if (userId) {
              // Fetch reviews for the selected user
              response = await fetch(`/api/reviews/${userId}`);
          } else if (establishmentId) {
              // Fetch reviews for the selected establishment
              response = await fetch(`/api/reviews/establishment/${establishmentId}`);
          } else {
              // No valid user or establishment ID, return early
              return;
          }
      
          if (!response.ok) {
              throw new Error(`Error fetching reviews (Status: ${response.status})`);
          }
      
          const data = await response.json();
          console.log('Fetched data:', data); // Add this log to see the entire data object
          return data.reviews; // Assuming the response contains the 'reviews' array
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return []; 
        }
    }

    async function updateReviewsTab(userId, establishmentId) {
        try {
            const reviews = await fetchReviews(userId, establishmentId);
            console.log(reviews);
            const reviewsContainer = $(".reviews-container");
            reviewsContainer.empty();
      
            if (reviews && Array.isArray(reviews)) {
                reviews.forEach((review) => {
                  const reviewHtml = createReviewElement(review);
                  reviewsContainer.append(reviewHtml);
                });
            }
        } catch (error) {
            console.error('Error updating reviews tab:', error);
          
        }
    }
      
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    const establishmentId = urlParams.get('establishmentId');
    console.log('userId:', userId);
    console.log('establishmentId:', establishmentId);
    
    
    function hideEstablishmentFields() {
        const establishmentFields = document.getElementById('establishmentFields');
        establishmentFields.style.display = 'none';
    }

    
    function showEstablishmentFields() {
        const establishmentFields = document.getElementById('establishmentFields');
        establishmentFields.style.display = 'block';
    }

    if (establishmentId) {
        showEstablishmentFields();
    } else {
        hideEstablishmentFields();
    }

    // Fetch the user data based on the userId
    const fetchUserDataPromise = fetchUserData(userId)
    .catch((error) => {
      console.error('Error fetching user data:', error);
      return {}; 
    });

    // Fetch the establishment data based on the establishmentId
    const fetchEstablishmentDataPromise = fetchEstablishmentData(establishmentId)
    .catch((error) => {
      console.error('Error fetching establishment data:', error);
      return {}; 
    });

    
    Promise.all([fetchUserDataPromise, fetchEstablishmentDataPromise])
      .then(([userData, establishmentData]) => {
        updateReviewsTab(userData._id, establishmentData._id);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });

    fetchEstablishmentData(establishmentId)
    .then((establishmentData) => {
      console.log('establishmentData:', establishmentData);
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
  updateReviewsTab(userId, establishmentId);
});

$(document).on("click", ".user-option", function () {
  const userId = $(this).data("user-id");

  // Redirect to the profile page with the selected user ID
  window.location.href = `/profile?userId=${userId}`;
});

$(document).on("click", ".establishment-option", function () {
  const establishmentId = $(this).data("establishment-id");
  window.location.href = `/profile?establishmentId=${establishmentId}`;
});

// Event handler for form submission
$('#updateForm').on('submit', async function (event) {
  event.preventDefault();

  // Get updated form input values
  const userName = $('#userName').val();
  const avatar = $('#avatar').val();
  const userDescription = $('#userDescription').val();
  const establishmentName = $('#establishmentName2').val();
  const establishmentShortDescription = $('#establishmentShortDescription').val();
  const establishmentDescription = $('#establishmentDescription').val();
  console.log('establishmentName:', establishmentName);
  // Create the updated data object to be sent to the server
  const updatedData = {
      newUsername: userName, // Updated key name to match the backend
      profileDescription: userDescription,
  };
  
  // Check if it's an establishment update
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('userId');
  const establishmentId = urlParams.get('establishmentId');
  if (establishmentId) {
      updatedData.name = establishmentName; // Set the establishment name
      updatedData.shortDescription = establishmentShortDescription; // Set the establishment short description
      updatedData.description = establishmentDescription; // Set the establishment description
  }
  console.log(establishmentName);

  try {
      // Send the update request to the backend endpoint with the correct establishmentId or userId
      const response = await fetch(establishmentId ? `/api/update-establishment/${establishmentId}` : `/api/update-user/${userId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
          throw new Error(`Error updating user or establishment details (Status: ${response.status})`);
      }

      const responseData = await response.json();
      console.log(responseData.message); // Log the success message from the backend

      // Display success message and update profileData with the updated details
      $('#updateSuccessMessage').show();
      //location.reload();
      profileData = responseData.user; // Update the frontend data with the updated data
      location.reload();
  } catch (error) {
      console.error('Error updating user or establishment details:', error);
      
  }
});



// Function to create an HTML review element using Handlebars template
function createReviewElement(review) {
  // Define the Handlebars template as a multi-line string
  const reviewTemplate = `
  <div class="col-lg-9 right-container">
  <div class="content-container">
      <div class="tab-content">
          <div id="juanderlast-points" class="tab-pane fade show active">
              <h1>Juanderlast Points</h1>
              <div>
                  Currently, you have no Juanderlast Points!
              </div>
          </div>
          <div id="promo-codes" class="tab-pane fade">
              <h1>Promo Codes</h1>
              <div>
                  No promo codes at the moment. Watch out for it!
              </div>
          </div>
          <div id="reviews" class="tab-pane fade">
              <h1>Reviews</h1>
              <div class="reviews-container">
                  <!-- Review containers will be added here -->
                  {{#each reviews}}
                      <div class="review-positioner">
                          <div class="review-container">
                              <div class="profile-container">
                                  <img class="profile-picture" src="{{review-pfp}}">
                                  <div class="post-details-container">
                                      <span class="profile-name"><a href="./profile1.html" style="color: black; text-decoration: none;">{{review-user}}</a></span>
                                      <span class="post-date">Last edited: {{review-date}}</span>
                                  </div>
                              </div>
                              <div class="review-rating-container">
                                  <!-- Render the review rating stars based on the 'rating' value -->
                                  {{#each (range rating)}}
                                      <i class="fa fa-star review-star-icon"></i>
                                  {{/each}}
                              </div>
                              <span class="review-title">
                                  {{review.title}}
                              </span>
                              <span class="review-content">
                                  {{review.body}}
                                  <span class="untruncate-button">Read more</span>
                              </span>
                              <span class="review-content untruncated-review">
                                  {{review.body}}
                                  <span class="truncate-button">Read less</span>
                              </span>
                              <div class="photo-album">
                                  {{#each review.images}}
                                      <img class="photo-album-photo" src="{{this}}">
                                  {{/each}}
                              </div>
                              <div class="userbuttons-container">
                                  <div class="helpful-container">
                                      <span class="helpful-icon"></span>
                                      <span class="helpful-text">Helpful {{review.helpfulFeedback}}</span>
                                      <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                      <span class="unhelpful-icon"></span>
                                      <span class="helpful-text">Unhelpful {{review.unhelpfulFeedback}}</span>
                                  </div>
                                  <div class="userreview-buttons-container">
                                      <div class="edit-button-container">
                                          <button class="edit-button" data-bs-toggle="modal" data-bs-target="#editReviewModal">
                                              <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                                          </button>
                                      </div>
                                      <div class="delete-button-container" data-bs-toggle="modal">
                                          <button class="delete-button">
                                              <i class="fa fa-trash" aria-hidden="true"></i>
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  {{/each}}
              </div>
          </div>
      </div>
  `;

  // Compile the Handlebars template
  const template = Handlebars.compile(reviewTemplate);
  const reviewHtml = template(review);
  return reviewHtml;
}
*/