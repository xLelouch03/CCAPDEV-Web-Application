$(document).ready(function() {

    $('#establishment-update-form').on('submit', async function (event) {
        event.preventDefault();

        // Get form input values
        const username = $('#username').val();
        const avatar = $('#new-avatar-dropdown').val();
        const profileDescription = $('#profileDescription').val();
        const name = $('#new-establishmentName').val();
        const location = $('#establishmentLocation').val();
        const category = $('#establishmentCategory').val();
        const description = $('#establishmentDescription').val();

        // Create the updated data object to be sent to the server
        const update = { username, avatar, profileDescription, name, location, category, description };

        // Send the object to the server
        try {
            const path = window.location.pathname;
            const parts = path.split('/');
            const id = parts[parts.length - 1];
            const response = await fetch(`/profile/establishment/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(update),
            });

            if (!response.ok) {
                throw new Error(`Error updating establishment details (Status: ${response.status})`);
            }
            const result = await response.json();
            console.log(result.message);
            $('#updateSuccessMessage').show();
            window.location.reload();
        } catch (error) {
            console.error('Error updating establishment details:', error);
            $('#updateFailureMessage').show();
        }
    });

    $('#user-update-form').on('submit', async function (event) {
        event.preventDefault();
    
        // Get form input values
        const username = $('#username').val();
        const avatar = $('#new-avatar-dropdown').val();
        const profileDescription = $('#profileDescription').val();
    
        // Create the updated data object to be sent to the server
        const update = { username, avatar, profileDescription };
    
        // Send the object to the server
        try {
            const path = window.location.pathname;
            const parts = path.split('/');
            const id = parts[parts.length - 1];
            const response = await fetch(`/profile/user/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(update),
            });
    
            if (!response.ok) {
                throw new Error(`Error updating user details (Status: ${response.status})`);
            }
            const result = await response.json();
            console.log(result.message);
            $('#updateSuccessMessage').show();
            location.reload();
        } catch (error) {
            console.error('Error updating user details:', error);
            $('#updateFailureMessage').show();
        }
    });

    // Manually populate the avatar dropdown
    function populateAvatarDropdown() {
        const avatarDropdown = $('#new-avatar-dropdown');

        // Specify the avatar image options manually
        const avatarOptions = [
            'avatar1.png',
            'avatar2.png',
            'avatar3.png',
            'avatar4.png',
            'avatar5.png',
            'avatar6.png',
            'avatar7.png',
            'avatar8.png'
        ];

         // Clear existing options
        avatarDropdown.empty();

        avatarOptions.forEach((avatar) => {
            const option = new Option('', `/static/avatars/${avatar}`);
            option.dataset['icon'] = `/static/avatars/${avatar}`; // Store the image URL in the data-icon attribute
            avatarDropdown.append(option);
        });

        // Initialize Select2
        avatarDropdown.select2({
            templateResult: formatAvatarOption, // Use a custom function to format the dropdown options
            templateSelection: formatAvatarOption, // Use the same function for selected options
        });
    }

    // Custom function to format the dropdown options
    function formatAvatarOption(option) {
        if (!option.id) {
            return option.text;
        }

        // Use the data-icon attribute to display the image
        const avatarUrl = $(option.element).data('icon');
        if (!avatarUrl) {
            return option.text;
        }

        const avatarImage = `<img src="${avatarUrl}" class="avatar-option-image" /> ${option.text}`;
        return $(avatarImage);
    }
    populateAvatarDropdown();
});