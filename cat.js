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
