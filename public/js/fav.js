document.addEventListener("DOMContentLoaded", function () {
    getFavorites();
});

async function getFavorites() {
    try {
        const sessionId = sessionStorage.getItem('sessionId');
        const username = sessionStorage.getItem('username');
        const response = await fetch('http://localhost:3000/get-favorites', {
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

            const listingsContainer = document.getElementById("listings-container");
            const listingTemplate = document.getElementById('listing-template');

            if (listingsContainer && listingTemplate && listings.length > 0) {
                const source = listingTemplate.textContent;
                const template = Handlebars.compile(source);
                const html = template({listings: listings});
                listingsContainer.innerHTML = html;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function deleteFavorite(listingId) {
    const sessionId = sessionStorage.getItem('sessionId'); // Get sessionId from sessionStorage
    const username = sessionStorage.getItem('username'); // Get username from sessionStorage
    fetch('http://localhost:3000/delete-favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            listingId: listingId,
            username: username,
            sessionId: sessionId,
        }),
    }).then((response) => {
        if (response.ok) {
            console.log('Successfully deleted favorite');
            window.location.reload();
        } else {
            console.error('Failed to delete favorite');
        }
    });
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

function delete_account() {
    fetch('http://localhost:3000/delete-account', {
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
                console.log('Account deleted successfully');
                window.location.href = 'index.html';
            } else {
                console.error('Failed to delete account');
            }
        })
        .catch(error => console.error('Error:', error));
    sessionStorage.removeItem('sessionId');
    console.log(window.location);

}


window.onload = function() {
    const isLoggedIn = sessionStorage.getItem('sessionId') !== null;
    if (isLoggedIn) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
        document.getElementById('favorites-button').style.display = 'block';
        document.getElementById('delete-button').style.display = 'block';
        
    } else {
        document.getElementById('login-section').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('favorites-button').style.display = 'none';
        document.getElementById('delete-button').style.display = 'none';
    }
}