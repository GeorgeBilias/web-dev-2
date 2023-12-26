
function toggleImage(id) {
    const button = document.getElementById(id);

    // Toggle between two images based on the current background image
    if (button.style.backgroundImage == 'url("photos/red-heart.png")') {
        button.style.backgroundImage = 'url("photos/heart.png")';
    } else {
        button.style.backgroundImage = 'url("photos/red-heart.png")';
    }

    
}