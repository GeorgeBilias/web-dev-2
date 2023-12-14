document.addEventListener("DOMContentLoaded", function () {
    const categoriesContainer = document.getElementById("categories-container");

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

            // Use Promise.all to fetch subcategories for all categories
            Promise.all(categories.map(category => fetchSubcategories(category.id)))
                .then(subcategoriesArray => {
                    categories.forEach((category, index) => {
                        category.subcategories = subcategoriesArray[index];
                    });

                    const html = template({ categories });
                    categoriesContainer.innerHTML = html;

                    // Attach click event listeners to category links
                    const categoryLinks = document.querySelectorAll(".category-link");
                    categoryLinks.forEach(link => {
                        link.addEventListener("click", function (event) {
                            event.preventDefault();
                            const categoryId = this.getAttribute("data-id");
                            // Redirect to the category page with the selected category ID
                            window.location.href = `/category.html?id=${categoryId}`;
                        });
                    });
                })
                .catch(error => console.error("Error fetching subcategories:", error));
        })
        .catch(error => console.error("Error fetching categories:", error));
});

