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
            alert('Please log in to add to favorites');
        }
    }

    function isLoggedIn() {
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: 'Ryan',
                password: 'Gosling',
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Store the sessionId in localStorage
            localStorage.setItem('sessionId', data.sessionId);
        })
        .catch(error => console.error('Error:', error));
        
        // Check if the sessionId exists in localStorage
        console.log(localStorage.getItem('sessionId'));
        return localStorage.getItem('sessionId') != null;
    }
    
    function getLoggedInUserSession() {
        // Get the sessionId from localStorage
        return localStorage.getItem('sessionId');
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