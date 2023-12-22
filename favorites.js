// Sample favorites handling script

// Function to toggle favorite status
function toggleFavorite(listingId) {
    const favorites = getFavorites(); // Get current favorites from storage
    const index = favorites.indexOf(listingId);

    if (index !== -1) {
        // Remove from favorites if already present
        favorites.splice(index, 1);
    } else {
        // Add to favorites if not present
        favorites.push(listingId);
    }

    saveFavorites(favorites); // Save updated favorites to storage
    updateHeartColor(listingId); // Update heart color
}

// Function to update heart color
function updateHeartColor(listingId) {
    const heart = document.querySelector(`[data-id="${listingId}"]`);
    if (heart) {
        const isFavorited = getFavorites().includes(listingId);
        heart.classList.toggle('favorited', isFavorited);
    }
}

// Function to get favorites from local storage
function getFavorites() {
    const favoritesJSON = localStorage.getItem('favorites');
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

// Function to save favorites to local storage
function saveFavorites(favorites) {
    const favoritesJSON = JSON.stringify(favorites);
    localStorage.setItem('favorites', favoritesJSON);
}

let isImage1 = true; // Flag to track the current image state

function toggleImage() {
    const button = document.querySelector('.heart');

    // Toggle between two images based on the flag
    if (isImage1) {
        button.style.backgroundImage = 'url("photos/red-heart.png")';
    } else {
        button.style.backgroundImage = 'url("photos/heart.png")';
    }

    // Toggle the flag for the next click
    isImage1 = !isImage1;
}
