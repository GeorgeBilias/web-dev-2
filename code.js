



document.addEventListener("DOMContentLoaded", function () {
    
    // Get the container for categories from the DOM
    const categoriesContainer = document.getElementById("categories-container");

    // Variable to store the fetched listings globally
    let globalListings;

    // Fetch categories from the WikiAds API
    fetch("https://wiki-ads.onrender.com/categories")
        .then(response => response.json())
        .then(categories => {
            // Use Handlebars to render the categories
            const source = document.getElementById("category-template").innerHTML;
            const template = Handlebars.compile(source);

            // Define a function to fetch subcategories for a given category
            function fetchSubcategories(categoryId) {
                return fetch(`https://wiki-ads.onrender.com/categories/${categoryId}/subcategories`)
                    .then(response => response.json());
            }

            // Define a function to fetch listings for a given subcategory
            function fetchListings(subcategoryId) {
                return fetch(`https://wiki-ads.onrender.com/ads?subcategory=${subcategoryId}`)
                    .then(response => response.json());
            }

        

            // Use Promise.all to fetch subcategories and listings for all categories
            Promise.all(categories.map(category => fetchSubcategories(category.id)))
                .then(subcategoriesArray => {
                    categories.forEach((category, index) => {
                        category.subcategories = subcategoriesArray[index];
                    });

                    // Render the categories using the Handlebars template
                    const html = template({ categories });
                    categoriesContainer.innerHTML = html;

                    // Attach click event listeners to category links
                    const categoryLinks = document.querySelectorAll(".category-link");
                    categoryLinks.forEach(link => {
                        link.addEventListener("click", function (event) {
                            event.preventDefault();
                            const subcategoryId = this.getAttribute("data-id");

                            // Fetch listings for the selected subcategory
                            fetchListings(subcategoryId)
                                .then(listings => {
                                    // Save the listings to local storage or a global variable
                                    globalListings = listings;

                                    // Redirect to the subcategories page
                                    window.location.href = `/subcategory.html?subcategory=${subcategoryId}`;
                                })
                                .catch(error => console.error("Error fetching listings:", error));
                        });
                    });
                })
                .catch(error => console.error("Error fetching subcategories:", error));
        })
        .catch(error => console.error("Error fetching categories:", error));

    

    
});
