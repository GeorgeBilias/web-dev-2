document.addEventListener("DOMContentLoaded", function () {
    const listingsContainer = document.getElementById("listings-container");

    function fetchListings(categoryId) {
        return fetch(`https://wiki-ads.onrender.com/ads?category=${categoryId}`)
            .then(response => response.json());
    }

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');

    console.log(categoryId)

    fetchListings(categoryId)
        .then(listings => {
            // Get the Handlebars template script
            const templateSource = document.getElementById("listing-template").innerHTML;
            
            // Compile the Handlebars template
            const template = Handlebars.compile(templateSource);
            
            // Render the listings using the template
            const html = template({ listings: listings });
            
            // Insert the rendered HTML into the container
            listingsContainer.innerHTML = html;
        })
        .catch(error => console.error("Error fetching listings:", error));
});



sessionId = null;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log(username, password);

    try {
        const token = sessionStorage.getItem('token')


        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Successful authentication
            document.getElementById('message').innerText = `Login successful. Session ID: ${result.sessionId}`;
            console.log(result.sessionId)
            sessionId = result.sessionId;
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
        } else if (response.status === 401) {
            // Unauthorized (incorrect credentials)
            document.getElementById('message').innerText = 'Invalid credentials. Please try again.';
        } else {
            // Other errors
            document.getElementById('message').innerText = 'An error occurred during login. Please try again later.';
        }
        
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}

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
                    if (heartButton.className === 'heart-favorite') {
                        console.log('Toggled unfavorite successfully');
                        heartButton.className = 'heart';
                    }else{
                        console.log('Toggled favorite successfully');
                        heartButton.className = 'heart-favorite';
                    }
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
    // Check if the user is logged in
    // Get the sessionId from localStorage
    
    console.log(sessionId);
    console.log(sessionId !== null);

    return sessionId !== null;
}

function getLoggedInUserSession() {
    
    return sessionId;    
}