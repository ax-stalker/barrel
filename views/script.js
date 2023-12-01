// script.js

function deleteUser(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        $.ajax({
            type: 'POST',
            url: '/admin/deleteUser',
            data: { userId: userId },
            success: function(response) {
                console.log(response);
                // Optionally, you can update the table or perform other actions on success
            },
            error: function(error) {
                console.error(error);
            }
        });
    }
}
