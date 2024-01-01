async function getFavorites() {
    const sessionId = sessionStorage.getItem('sessionId'); // Get sessionId from sessionStorage
    const response = await fetch('http://localhost:3000/get-favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                sessionId: sessionId,
            }),
        });
    if (response.ok) {
        const favorites = await response.json();
        console.log(`User's favorite ads:`, favorites);

        const favoritesContainer = document.getElementById('listings-container');
        const favContainer = document.createElement('div');
        favContainer.classList.add('listings');
        
        // Create the ol element
        const favList = document.createElement('ol');
        favList.classList.add('grid');
        
        favorites.forEach((ad) => {
            const adContainer = document.createElement('li');
            adContainer.classList.add('listing');
            adContainer.innerHTML = `
                <h3>${ad.title}</h3>
                <ul>
                    <li>
                        <ul>
                            <li class="img">
                                <img src="${ad.image_url}" alt="" height="200px">
                            </li>
                        </ul>
                    </li>
                    <li>${ad.description}</li>
                    <div class="cost">
                        <li class="cost">${ad.cost} €</li>
                    </div>
                </ul>
            `;
        
            // Append the adContainer to the favList
            favList.appendChild(adContainer);
        });
        
        // Append the favList to the favContainer
        favContainer.appendChild(favList);
        
        favoritesContainer.appendChild(favContainer);

    } else {
        console.error('Failed to fetch user favorites');
    }
}
