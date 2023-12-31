    function toggleFavorite(id) {
        const heartButton = document.getElementById(id);

        if (isLoggedIn()) {
            console.log('User is logged in');
            // Call the Add to Favorites Service (AFS) with necessary data
            fetch('http://localhost:3000/toggle-favorite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listingId: id,
                    username: username,
                    sessionId: getLoggedInUserSession(),
                }),
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Toggled favorite successfully');
                        // Toggle the heart icon here
                        heartButton.className = 'heart-favorite';
                    } else {
                        console.error('Failed to toggle favorite');
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            alert('Παρακαλώ συνδεθείτε για προσθήκη στη λίστα αγαπημένων');
        }
    }

    function isLoggedIn() {
        // Check if the user is logged in
        // Get the sessionId from localStorage
        const sessionId = localStorage.getItem('sessionId');
        console.log(sessionId);
        console.log(sessionId !== undefined);
    }
    
    function getLoggedInUserSession() {
        // Get the sessionId from localStorage
        
    }

// useless now   
function toggleImage(id) {
    const button = document.getElementById(id);

    // Toggle between two images based on the current background image
    if (button.style.backgroundImage == 'url("photos/red-heart.png")') {
        button.style.backgroundImage = 'url("photos/heart.png")';
    } else {
        button.style.backgroundImage = 'url("photos/red-heart.png")';
    }

    
}