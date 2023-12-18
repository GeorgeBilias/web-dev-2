document.addEventListener("DOMContentLoaded", function () {

    console.log("DOM loaded");
    
    const listingsContainer = document.getElementById("listings-container");

    function fetchListings(subcategoryId) {
        return fetch(`https://wiki-ads.onrender.com/ads?subcategory=${subcategoryId}`)
            .then(response => response.json());
    }

    // Assume you have the subcategoryId from somewhere
    const urlParams = new URLSearchParams(window.location.search);
    const subcategoryId = urlParams.get('subcategory');


    console.log("Subcategory ID:", subcategoryId);

    fetchListings(subcategoryId)
        .then(listings => {
            // Log retrieved listings data to the console
            console.log("Retrieved listings:", listings);

            // Get the Handlebars template from the script tag
            const templateSource = document.getElementById("listing-template").innerHTML;
            const template = Handlebars.compile(templateSource);

            // Render the listings using Handlebars
            const html = template({ listings });
            listingsContainer.innerHTML = html;
        })
        .catch(error => console.error("Error fetching listings:", error));
});
