document.addEventListener("DOMContentLoaded", function () {
    const listingsContainer = document.getElementById("listings-container");
    const subcategoriesMenuContainer = document.getElementById('subcategories-container');

    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const subcategoryId = urlParams.get('subcategory');

    // Fetch both listings and subcategories concurrently
    Promise.all([
        fetch(`https://wiki-ads.onrender.com/ads?category=${categoryId}`),
        fetch(`https://wiki-ads.onrender.com/categories/${categoryId}/subcategories`)
    ])
    .then(([listingsResponse, subcategoriesResponse]) => Promise.all([listingsResponse.json(), subcategoriesResponse.json()]))
    .then(([listings, subcategories]) => {
        // Filter listings based on subcategoryId
        if (subcategoryId) {
            listings = listings.filter(listing => listing.subcategory_id == subcategoryId);
        }

        // Replace the /' in description with \'
        listings.forEach(listing => {
            listing.description = listing.description.replace(/\/'/g, "\\'");
        });

        Handlebars.registerHelper('unescapeBackslashes', function (text) {
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

        // Set the heart buttons as favorites if they are in the user's favorites list
        if (sessionStorage.getItem('sessionId') !== null) {
            checkFavorites();
        }

        // Render the subcategories menu for the selected category
        subcategoriesMenuContainer.innerHTML = generateSubcategoriesMenu(subcategories, subcategoryId);

        // Add event listener to subcategories menu
        subcategoriesMenuContainer.addEventListener('change', function (event) {
            const selectedSubcategory = event.target.value;
            // Filter listings based on selected subcategory locally
            const filteredListings = selectedSubcategory ?
                listings.filter(listing => listing.subcategory_id == selectedSubcategory) :
                listings;

            // Render the filtered listings using the template
            const html = template({ listings: filteredListings });

            // Update the listings container with the new HTML content
            listingsContainer.innerHTML = html;

            // Set the heart buttons as favorites if they are in the user's favorites list
            if (sessionStorage.getItem('sessionId') !== null) {
                checkFavorites();
            }
        });
    })
    .catch(error => console.error("Error fetching data:", error));
});

function generateSubcategoriesMenu(subcategories, currentSubcategory) {
    const menu = subcategories.map(subcategory => `
        <label class="subcategory-label">
            <input type="radio" name="subcategory" value="${subcategory.id}" ${subcategory.id === currentSubcategory ? 'checked' : ''}>
            ${subcategory.title}
        </label>
    `).join('');

    return `
        <div class="subcategory-menu">
            <label class="subcategory-label">
                <input type="radio" name="subcategory" value="" ${!currentSubcategory ? 'checked' : ''}>
                'Oλα
            </label>
            ${menu}
        </div>
    `;
}

function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
    .then(response => {
        if (response.ok) {
            // Registration successful
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid green';
            document.getElementById('password').style.border = '1px solid green';
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'hidden';
            alert('Επιτυχής εγγραφή. Παρακαλώ συνδεθείτε.');
            return { message: 'Registration successful' };
        } else if (response.status === 400) {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid red';
            document.getElementById('password').style.border = '1px solid red';
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'visible';
            alert('Το όνομα χρήστη υπάρχει ήδη. Παρακαλώ επιλέξτε άλλο όνομα χρήστη.')
            //RED BORDER TO INPUT FIELD
            return response.json();
        } else if (response.status === 401) {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid red';
            document.getElementById('password').style.border = '1px solid red';
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'visible';
            alert('Username must be at least 3 characters long and not start with a number.')
            //RED BORDER TO INPUT FIELD
            return response.json();
        } else if (response.status === 402) {
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid red';
            document.getElementById('password').style.border = '1px solid red';
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'visible';
            alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number.')
            //RED BORDER TO INPUT FIELD
            return response.json();
        }

    })
    .then(data => {
        // Handle the response from the server
        console.log(data.message);
    })
    .catch(error => {
        console.error('Error during registration:', error);
    });
}

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
            sessionStorage.setItem('sessionId', sessionId);
            sessionStorage.setItem('username', username);
            
            document.getElementById('login-section').style.display = 'none';
            document.getElementById('logout-button').style.display = 'block';
            document.getElementById('favorites-button').style.display = 'block';
            window.location.reload();
        } else if (response.status === 401) {
            // Unauthorized (incorrect credentials)
            document.getElementById('message').innerText = 'Invalid credentials. Please try again.';
            // add red border to input fields
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid red';
            document.getElementById('password').style.border = '1px solid red';
            // make the i visible in the input field
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'visible';
            alert('Λάθος στοιχεία. Παρακαλώ προσπαθήστε ξανά.')
        } else {
            // Other errors
            document.getElementById('message').innerText =
                'An error occurred during login. Please try again later.';
            // add red border to input fields
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            document.getElementById('username').style.border = '1px solid red';
            document.getElementById('password').style.border = '1px solid red';
            // make the i visible in the input field
            document.getElementsByClassName('fas fa-check-circle')[0].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-check-circle')[1].style.visibility = 'hidden';
            document.getElementsByClassName('fas fa-exclamation-circle')[0].style.visibility = 'visible';
            document.getElementsByClassName('fas fa-exclamation-circle')[1].style.visibility = 'visible';
        }
    } catch (error) {
        console.error('Error during login:', error.message);
    }
}


function toggleFavorite(id,title,description,cost,image_url) {
    const heartButton = document.getElementById(id);

    sessionId = sessionStorage.getItem('sessionId');

    if (isLoggedIn(sessionId)) {
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
                image_url: image_url,
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

function isLoggedIn(sessionId) {
    // Check if the user is logged in
    // Get the sessionId from localStorage
    
    console.log(sessionId);
    console.log(sessionId !== null);

    return sessionId !== null;
}

function getLoggedInUserSession(sessionId) {
    
    return sessionId;    
}

function favorites_button() {
    console.log("Favorites button clicked");
    sessionId = sessionStorage.getItem('sessionId');
    sessionId = getLoggedInUserSession(sessionId);
    console.log("Session id from favorites button :"+sessionId)
    username = sessionStorage.getItem('username');
    console.log("Username from favorites button :"+username)
    window.location.href = `favorites.html?username=${username}&sessionId=${sessionId}`;
}

function logout() {
    fetch('http://localhost:3000/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionId: sessionStorage.getItem('sessionId'),
        }),
    })
        .then(response => {
            if (response.ok) {
                console.log('Logged out successfully');
                window.location.href = 'index.html';
            } else {
                console.error('Failed to log out');
            }
        })
        .catch(error => console.error('Error:', error));
    sessionStorage.removeItem('sessionId');
    console.log(window.location);
}

async function checkFavorites() {
    const sessionId = sessionStorage.getItem('sessionId'); // Get sessionId from sessionStorage
    const username = sessionStorage.getItem('username'); // Get username from sessionStorage
    const response = await fetch('http://localhost:3000/check-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                sessionId: sessionId,
            }),
        });
    if (response.ok) {
        const listings = await response.json();
        console.log(`User's favorite ads:`, listings);
        listings.forEach(listing => {
            if (document.getElementById(listing.listingId) !== null) {
                const heartButton = document.getElementById(listing.listingId);
                heartButton.className = 'heart-favorite';
            }
        });
    }else{
        console.error('Failed to fetch user favorites');
    }
}


window.onload = function() {
    const isLoggedIn = sessionStorage.getItem('sessionId') !== null;
    if (isLoggedIn) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
        document.getElementById('favorites-button').style.display = 'block';
        
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('favorites-button').style.display = 'none';
    }
}