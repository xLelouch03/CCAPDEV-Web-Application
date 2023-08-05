$(document).ready(function() {

    // Switch to register form
    $('#registerLink').click(function() {
        $('#loginModal').modal('hide');
        $('#registerModal').modal('show');
        $('body').removeClass('modal-open'); 
        $('.modal-backdrop').remove(); 
    });

    // Switch to login form
    $('#loginLink').click(function() {
        $('#registerModal').modal('hide');
        $('#loginModal').modal('show');
        $('body').removeClass('modal-open'); 
        $('.modal-backdrop').remove(); 
    });

    // Clear input fields and checkboxes on modal close
    $('#loginModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
        $('#loginRememberMe').prop('checked', false);
    });

    $('#registerModal').on('hidden.bs.modal', function() {
        $(this).find('input').val('');
    });

    $('#role').on('change', function () {
        const selectedRole = $(this).val();
        const establishmentOnlyFields = $('.establishment-only');

        // Hide all establishment-only fields
        establishmentOnlyFields.hide();

        // If role is "establishment", show the establishment-only fields; otherwise, show the user fields
        if (selectedRole === 'establishment') {
            establishmentOnlyFields.show();
            $('#description3').hide();
        } else {
            $('#description3').show();
        }
    });

    $("#reviewsTabLink").on("click", function() {
        // Get the user ID and establishment ID from your URL
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        const establishmentId = urlParams.get('establishmentId');

        updateReviewsTab(userId, establishmentId);
    });

    $('#registerForm').on('submit', function (event) {
        event.preventDefault();
        console.log("REGISTER CLICKED");

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
        if (role === 'establishment') {
            requestData.name = $('#establishmentName').val();
            requestData.description = $('#description').val();
            requestData.category = $('#category').val();
            requestData.location = $('#location').val();

            // Extract the file name from the establishmentPhotos input field
            /*
            const establishmentPhotosInput = $('#establishmentPhotos')[0];
            const establishmentPhotosFileName = establishmentPhotosInput.files[0].name;
            requestData.establishmentPhotos = `/static/images/${establishmentPhotosFileName}`;
            
            handleImageUpload(establishmentPhotosInput, establishmentPhotosFileName);
            */

        } else {
            /*
            const avatarInput = $('#avatar')[0];
            const avatarFileName = avatarInput.files[0].name;
            requestData.avatar = `static/images/${avatarFileName}`;
            
            handleImageUpload(avatarInput, avatarFileName);
            */
        }
        
        // Determine the correct route based on the role
        const signupRoute = role === 'establishment' ? '/register-establishment' : '/register-user';

        // Make the AJAX request
        $.ajax({
            type: 'POST',
            url: signupRoute,
            data: JSON.stringify(requestData),
            contentType: 'application/json', 
            success: (response) => {
                window.location.href = '/';
            },
            error: (error) => {
                console.error('Error registering user:', error.responseText);
            }
        });
    });

    window.addEventListener("load", function (e) {
        const username = document.querySelector("#loginUsername");
        const password = document.querySelector("#loginPassword");
        const role = document.querySelector("#loginRole");
        const login = document.querySelector("#loginBtn");

        login?.addEventListener("click", async (e) => {
            e.preventDefault();

            const loginData = {
                username: username.value,
                password: password.value,
                role: role.value
            };

            try {
                let loginRoute = "/login-user";
                if (loginData.role === "Establishment") {
                    loginRoute = "/login-establishment";
                }

                const response = await fetch(loginRoute, {
                    method: 'POST',
                    body: JSON.stringify(loginData),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.status === 200) {
                    // Login successful, reload the page
                    this.location.reload();
                } else {
                    const data = await response.json(); 
                    const message = data.message;
                    alert("Login failed. " + message);
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred during login. Please try again later.");
            }
        });
    });

    $('#logout').click(function() {
        window.location.href = '/logout';
    });
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