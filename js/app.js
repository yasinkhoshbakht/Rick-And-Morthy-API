document.addEventListener("DOMContentLoaded", () => {
  let characterContainer = document.getElementById("character-container");
  let loadingIndicator = document.getElementById("loading");
  let searchInput = document.getElementById("searchInput");
  let characterInfo = document.getElementById("character-info");
  let favoriteToggle = document.getElementById("favorite-toggle");
  let favoriteModal = document.getElementById("favorite-modal");
  let favoriteContainer = document.getElementById("favorite-container");
  let closeModal = document.getElementById("close-modal");
  let themeToggle = document.getElementById("theme-toggle");

  let characters = [];
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  let fetchCharacters = () => {
    axios
      .get("https://rickandmortyapi.com/api/character")
      .then((response) => {
        characters = response.data.results;
        displayCharacters(characters);
        loadingIndicator.style.display = "none";
        characterContainer.style.display = "flex";
      })
      .catch((error) => {
        console.error("Error fetching characters", error);
      });
  };

  let displayCharacters = (characters) => {
    characterContainer.innerHTML = "";
    characters.forEach((character) => {
      let characterCard = document.createElement("div");
      characterCard.classList.add("character-card");

      let characterImage = document.createElement("img");
      characterImage.src = character.image;
      characterImage.alt = character.name;

      let characterName = document.createElement("h2");
      characterName.textContent = character.name;

      let characterStatus = document.createElement("p");
      characterStatus.classList.add("character-status");
      characterStatus.textContent = `Status: ${character.status}`;
      if (character.status === "Dead") {
        characterStatus.classList.add("dead");
      } else if (character.status === "unknown") {
        characterStatus.classList.add("unknown");
      }

      let characterGender = document.createElement("p");
      characterGender.textContent = `Gender: ${character.gender}`;

      let viewInfoBtn = document.createElement("button");
      viewInfoBtn.classList.add("view-info-btn");
      viewInfoBtn.textContent = "View Info";
      viewInfoBtn.addEventListener("click", () => showCharacterInfo(character));

      let favoriteBtn = document.createElement("button");
      favoriteBtn.classList.add("favorite-btn");
      favoriteBtn.textContent = "Favorite";
      favoriteBtn.addEventListener("click", () => toggleFavorite(character));

      characterCard.appendChild(characterImage);
      characterCard.appendChild(characterName);
      characterCard.appendChild(characterStatus);
      characterCard.appendChild(characterGender);
      characterCard.appendChild(viewInfoBtn);
      characterCard.appendChild(favoriteBtn);

      characterContainer.appendChild(characterCard);
    });
  };

  let showCharacterInfo = (character) => {
    characterInfo.innerHTML = `
            <button id="close-info" class="close-info">&times;</button>
            <h2>${character.name}</h2>
            <img src="${character.image}" alt="${character.name}">
            <p><strong>Status:</strong> ${character.status}</p>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Species:</strong> ${character.species}</p>
            <p><strong>Origin:</strong> ${character.origin.name}</p>
            <p><strong>Location:</strong> ${character.location.name}</p>
        `;
    characterInfo.style.display = "block";
    characterInfo.classList.add("show");

    document.getElementById("close-info").addEventListener("click", () => {
      characterInfo.style.display = "none";
      characterInfo.classList.remove("show");
    });
  };

  let toggleFavorite = (character) => {
    let index = favorites.findIndex((fav) => fav.id === character.id);
    if (index === -1) {
      favorites.push(character);
    } else {
      favorites.splice(index, 1);
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(favorites);
  };

  let displayFavorites = (favorites) => {
    favoriteContainer.innerHTML = "";
    if (favorites.length > 0) {
      favorites.forEach((character) => {
        let characterCard = document.createElement("div");
        characterCard.classList.add("character-card");

        let characterImage = document.createElement("img");
        characterImage.src = character.image;
        characterImage.alt = character.name;

        let characterName = document.createElement("h2");
        characterName.textContent = character.name;

        let removeBtn = document.createElement("button");
        removeBtn.classList.add("remove-btn");
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", () => toggleFavorite(character));

        characterCard.appendChild(characterImage);
        characterCard.appendChild(characterName);
        characterCard.appendChild(removeBtn);

        favoriteContainer.appendChild(characterCard);
      });
    }
  };

  favoriteToggle.addEventListener("click", () => {
    favoriteModal.classList.toggle("show");
  });

  closeModal.addEventListener("click", () => {
    favoriteModal.classList.remove("show");
  });

  window.addEventListener("click", (event) => {
    if (event.target === favoriteModal) {
      favoriteModal.classList.remove("show");
    }
  });

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  searchInput.addEventListener("input", (event) => {
    let searchTerm = event.target.value.toLowerCase();
    let filteredCharacters = characters.filter((character) =>
      character.name.toLowerCase().includes(searchTerm)
    );
    displayCharacters(filteredCharacters);
  });

  fetchCharacters();
  displayFavorites(favorites);
});
