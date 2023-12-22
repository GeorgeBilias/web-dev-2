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

