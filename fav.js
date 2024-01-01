document.addEventListener("DOMContentLoaded", function () {
    getFavorites();
async function getFavorites() {
    const sessionId = sessionStorage.getItem('sessionId'); // Get sessionId from sessionStorage
    const username = sessionStorage.getItem('username'); // Get username from sessionStorage
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
        // Get the template from the HTML document
        const source = document.getElementById('listing-template').innerHTML;

        // Compile the template
        const template = Handlebars.compile(source);

        
        // Generate the HTML for this ad using the template
        const html = template({listings: listings});

        // Append the generated HTML to the favList
        listingsContainer.innerHTML = html;

    } else {
        console.error('Failed to fetch user favorites');
    }
}
});