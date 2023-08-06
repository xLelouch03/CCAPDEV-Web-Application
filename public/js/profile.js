$(document).ready(function() {

    $('#establishment-update-form').on('submit', async function (event) {
        event.preventDefault();

        // Get form input values
        const username = $('#username').val();
        const avatar = $('#new-avatar').val();
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
            location.reload();
        } catch (error) {
            console.error('Error updating establishment details:', error);
            $('#updateFailureMessage').show();
        }
    });

    $('#user-update-form').on('submit', async function (event) {
        event.preventDefault();
    
        // Get form input values
        const username = $('#username').val();
        const avatar = $('#new-avatar').val();
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
});