$(document).ready(function() {

    $('#update-establishment-info').on('submit', async function (event) {
        event.preventDefault();

        // Get form input values
        const username = $('#username').val();
        const avatar = $('#avatar').val();
        const profileDescription = $('#profileDescription').val();
        const name = $('#establishmentName').val();
        const location = $('#establishmentLocation').val();
        const category = $('#establishmentCategory').val();
        const description = $('#establishmentDescription').val();

        // Create the updated data object to be sent to the server
        const update = { username, avatar, profileDescription, name, location, category, description };

        // Send the object to the server
        try {
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
});