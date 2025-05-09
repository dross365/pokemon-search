const baseURL = 'https://pokeapi.co/api/v2/';



window.onload = () => {
  const searchButton = document.getElementById('submitBtn');
  const searchTypeButton = document.getElementById('typeBtn');
  searchButton.addEventListener('click', getInput);
  searchTypeButton.addEventListener('click', showRandomPokemon);
};

const getInput = async event => {
  event.preventDefault();
  const input = document.getElementById('pokemon').value.trim().toLowerCase();
  const pokemonName = await getPokemonInfo(input);
  if (pokemonName) {
    displayPokemon(pokemonName);
  }
}

const showRandomPokemon = async event => {
  event.preventDefault();
  clearCurrentPokemon();

  const selectedType = getSelectedType();
  const endpoint = `type/${selectedType}`;
  const urlToFetch = `${baseURL}${endpoint}`;

  try {
    const response = await fetch(urlToFetch);
    if(response.ok) {
      const responseJson = await response.json();
      const allPokemon = responseJson.pokemon.map(p => p.pokemon.name);
      const randomIndex = Math.floor(Math.random() * allPokemon.length);
      const randomPokemon = allPokemon[randomIndex];

      const info = await getPokemonInfo(randomPokemon);
      if(info) {
        displayPokemon(info);
      }
    } else {
      displayError('Type not found.');
    }
  } catch(e) {
    console.log(e);
    displayError('An error occurred while fetching Pokemon by type.')
  }
}

const getPokemonInfo = async (pokemon) => {
  const endpoint = `pokemon/${pokemon}`;
  const UrlToFetch = `${baseURL}${endpoint}`;

  try {
    const response = await fetch(UrlToFetch);
    if(response.ok) {
      const jsonInfo = await response.json();
      return jsonInfo;
    } else {
      displayError('Pokemon Not Found!');
    }
  } catch (e) {
    console.log(e);
  }
}

const getTypes = async () => {
  const typeRequestEndpoint = "type";
  const urlToFetch = `${baseURL}${typeRequestEndpoint}`;

  try {
    const response = await fetch(urlToFetch);

    if(response.ok) {
      const jsonResponse = await response.json();
      const typeName = jsonResponse.results;
      console.log(typeName);
      return typeName;
    }
  } catch (e) {
    console.log(e);
  }
};

const getSelectedType = () => {
  const selectedType = document.getElementById('types').value;
  return selectedType;
}

const clearCurrentPokemon = () => {
  const errorDiv = document.getElementById('errorDiv');
  const pokemonNameDiv = document.getElementById('pokemonDisplay');
  const pokemonAbilities = document.getElementById('pokemonAbilities');
  errorDiv.innerHTML = '';
  pokemonNameDiv.innerHTML = '';
  pokemonAbilities.innerHTML = '';
}

const createPokemonName = pokemonName => {
  const nameText = document.createElement('h3');
  nameText.innerText = pokemonName;

  return nameText;
}

const getRandomPokemon = (type) => {
  const randomIndex = Math.floor(Math.random() * type.length);
  const randomPokemon = type[randomIndex];

  return randomPokemon;
}

const displayPokemon = pokemon => {
  const pokemonNameDiv = document.getElementById('pokemonDisplay');
  const pokemonAbilitiesDiv = document.getElementById('pokemonAbilities');

  
  clearCurrentPokemon();

  // Create HTML content containing pokemon info
  const nameElement = createPokemonName(pokemon.name);

  // Create ability Elements
  const abilities = pokemon.abilities.map(item => {
    const abilityText = document.createElement('p');
    abilityText.innerText = item.ability.name;
    return abilityText;
  });

  // Append to page
  pokemonNameDiv.appendChild(nameElement);
  const imageElementShiny = document.createElement('img');
  const imageElementDefault = document.createElement('img');
  imageElementDefault.src = pokemon.sprites.front_default;
  pokemonNameDiv.appendChild(imageElementDefault);
  abilities.forEach(ability => pokemonAbilitiesDiv.appendChild(ability));
}

const populateDropdown = types => {
  const select = document.getElementById('types');

  for(const type of types) {
    let option = document.createElement('option');
    option.text = type.name;
    select.appendChild(option);
  }
}

const createErrorElement = errorMessage => {
  const errorText = document.createElement('p');
  errorText.innerText = errorMessage;

  return errorText;
}

const displayError = errorMessage => {
  const errorDiv = document.getElementById('errorDiv');
  errorDiv.innerHTML = '';

  // Create HTML content containing error
  const errorElement = createErrorElement(errorMessage);

  errorDiv.appendChild(errorElement);
}

getTypes().then(populateDropdown);