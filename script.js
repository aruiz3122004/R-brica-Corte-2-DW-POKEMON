// Array con los nombres de los 15 Pokémon a mostrar
const pokemonList = [
    'eeve', 'pikachu', 'charizard', 'bulbasaur', 'squirtle',
    'jigglypuff', 'mewtwo', 'hypno', 'snorlax', 'magikarp',
    'machamp', 'metapod', 'greninja', 'vaporeon', 'Lucario'
];

// Declarar elementos 
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonFilter = document.getElementById('pokemon-filter');

// Función principal que carga los Pokémon
async function loadPokemons() {
    try {
        // Cargar datos de todos los Pokémon
        const pokemons = await Promise.all(
            pokemonList.map(name => fetchPokemonData(name))
        );
        
        // Mostrar todos los Pokémon
        displayPokemons(pokemons);
        
        // Llenar el select de filtrado
        populateFilterOptions(pokemons);
        
    } catch (error) {
        console.error('Error al cargar los Pokémon:', error);
        pokemonContainer.innerHTML = '<p class="error">Error al cargar los Pokémon. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}

// Función para obtener datos de un Pokémon específico
async function fetchPokemonData(pokemonName) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);
        if (!response.ok) {
            throw new Error(`Pokémon no encontrado: ${pokemonName}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al cargar ${pokemonName}:`, error);
        return null;
    }
}

// Función para mostrar los Pokémon
function displayPokemons(pokemons, filter = 'all') {
    pokemonContainer.innerHTML = '';
    
    const filteredPokemons = filter === 'all' 
        ? pokemons 
        : pokemons.filter(p => p && p.name === filter);
    
    filteredPokemons.forEach(pokemon => {
        if (!pokemon) return;
        
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        // Obtener la habilidad principal
        const mainAbility = pokemon.abilities[0]?.ability?.name || 'unknown';
        
        card.innerHTML = `
            <div class="pokemon-image">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            </div>
            <div class="pokemon-info">
                <h3 class="pokemon-name">${pokemon.name}</h3>
                <p class="pokemon-ability">Habilidad: ${mainAbility}</p>
            </div>
        `;
        
        pokemonContainer.appendChild(card);
    });
}

// Función para llenar las opciones del select de filtrado
function populateFilterOptions(pokemons) {
    // Ordenar los Pokémon alfabéticamente
    const sortedPokemons = [...pokemons].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedPokemons.forEach(pokemon => {
        if (!pokemon) return;
        
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonFilter.appendChild(option);
    });
    
    // Event listener para el filtrado
    pokemonFilter.addEventListener('change', (e) => {
        displayPokemons(pokemons, e.target.value);
    });
}

// Cargar los Pokémon cuando la página esté lista
document.addEventListener('DOMContentLoaded', loadPokemons);
