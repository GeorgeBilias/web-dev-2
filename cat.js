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

            // Replace the /' in description with \'
            listings.forEach(listing => {
                listing.description = listing.description.replace(/\/'/g, "\\'");
            });

            Handlebars.registerHelper('unescapeBackslashes', function(text) {
                return new Handlebars.SafeString(text.replace(/\\'/g, "'"));
            });
            

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
        const token = sessionStorage.getItem('token');

        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ username, password }),
        });

        const result = await response.json();

        if (response.ok) {
            // Successful authentication
            document.getElementById('message').innerText = `Login successful. Session ID: ${result.sessionId}`;
            console.log("Session id from login service :"+result.sessionId);
            sessionId = result.sessionId;

            // Display the contents of the user's favorite ads list
            fetchUserFavorites();
            
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('favorites-button').style.display = 'block';
        } else if (response.status === 401) {
            // Unauthorized (incorrect credentials)
            document.getElementById('message').innerText = 'Invalid credentials. Please try again.';
        } else {
            // Other errors
            document.getElementById('message').innerText =
                'An error occurred during login. Please try again later.';
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}

async function fetchUserFavorites() {
    if (isLoggedIn()) {
        const response = await fetch('http://localhost:3000/get-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId,
            }),
        });

        if (response.ok) {
            const favorites = await response.json();
            console.log(`User's favorite ads:`, favorites);
        } else {
            console.error('Failed to fetch user favorites');
        }
    }
}

function toggleFavorite(id,title,description,cost) {
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
                sessionId: sessionId,
                listingId: id,
                title: title,
                description: description,
                cost: cost,
            }),
        })
            .then(response => {
                if (response.ok) {
                    if (heartButton.className === 'heart-favorite') {
                        console.log('Toggled unfavorite successfully');
                        heartButton.className = 'heart';
                    } else {
                        console.log('Toggled favorite successfully');
                        heartButton.className = 'heart-favorite';
                    }
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
    
    console.log(sessionId);
    console.log(sessionId !== null);

    return sessionId !== null;
}

function getLoggedInUserSession() {
    
    return sessionId;    
}

function favorites_button() {
    console.log("Favorites button clicked");
    sessionId = getLoggedInUserSession();
    console.log("Session id from favorites button :"+sessionId)
    username = document.getElementById('username').value;
    console.log("Username from favorites button :"+username)
    window.location.href = `favorites.html?username=${username}&sessionId=${sessionId}`;
    window.location.href
}