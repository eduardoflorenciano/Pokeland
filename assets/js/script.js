// Configurações
const CONFIG = {
    pokemonCount: 150,
    apiBaseUrl: 'https://pokeapi.co/api/v2',
    batchSize: 20, // Carregar em lotes para melhor UX
}

// Cores das bordas de cada tipo de pokémon
const typeColors = {
    normal: '#9E9E9E',
    fire: '#FF6B6B',
    water: '#42A5F5',
    electric: '#FDD835',
    grass: '#4CAF50',
    ice: '#80DEEA',
    fighting: '#FF7043',
    poison: '#AB47BC',
    ground: '#D4A574',
    flying: '#90CAF9',
    psychic: '#EC407A',
    bug: '#9CCC65',
    rock: '#A1887F',
    ghost: '#9575CD',
    dragon: '#7E57C2',
    dark: '#616161',
    steel: '#90A4AE',
    fairy: '#F48FB1',
}

// Elementos DOM
const pokeContainer = document.getElementById('pokeContainer');
const searchInput = document.getElementById('searchPokemon');

// Estado da aplicação
let allPokemons = [];
let isLoading = false;

// Funções auxiliares

// Formata o número de pokémons com zeros à esquerda
function formatPokemonNumber(number) {
    return `Nº ${number.toString().padStart(3, '0')}`;
}

// Capitaliza a primeira letra
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Obtém a cor baseada no tipo principal
function getTypeColor(types) {
    const mainTypes = Object.keys(typeColors);
    const pokemonTypes = types.map(t => t.type.name);
    const primaryType = mainTypes.find(type => pokemonTypes.includes(type));
    return typeColors[primaryType] || typeColors.normal;
}

// Exibe as estatísticas do pokémon
function showPokemonDetails(pokemon) {
    const { id, name, types, height, weight, abilities, stats } = pokemon;

    // Formata os tipos
    const typesList = types.map(t => {
        const typeName = capitalize(t.type.name);
        const color = typeColors[t.type.name] || typeColors.normal;
        return `<span class="type-badge" style="background-color: ${color}">${typeName}</span>`;
    }).join('');

    const abilitiesList = abilities
        .map(a => capitalize(a.ability.name.replace('-', ' ')))
        .join(', ');

    // Mostra as estatísticas
    const statsHTML = stats.map(stat => `
        <div class="stat-item">
            <span class="stat-name">${capitalize(stat.stat.name)}:</span>
            <span class="stat-value">${stat.base_stat}</span>
            <div class="stat-bar">
                <div class="stat-fill" style="width: ${(stat.base_stat / 255) * 100}%"></div>
            </div>
        </div>
        `).join('');

    // Cria o modal
    const modal = document.createElement('div');
    modal.classList.add('modal-overlay');
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Fechar">&times;</button>
            <div class="modal-header">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" 
                     alt="${capitalize(name)}">
                <h2>${capitalize(name)}</h2>
                <span class="modal-number">${formatPokemonNumber(id)}</span>
            </div>
            <div class="modal-body">
                <div class="detail-group">
                    <strong>Tipo:</strong> ${typesList}
                </div>
                <div class="detail-group">
                    <strong>Altura:</strong> ${(height / 10).toFixed(1)}m
                </div>
                <div class="detail-group">
                    <strong>Peso:</strong> ${(weight / 10).toFixed(1)}kg
                </div>
                <div class="detail-group">
                    <strong>Habilidades:</strong> ${abilitiesList}
                </div>
                <div class="stats-container">
                    <h3>Estatísticas Base</h3>
                    ${statsHTML}
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Fecha o modal ao clicar no X ou fora
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    })

    // Fecha com ESC
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', escClose);
        }
    });
}

// Busca dados da espécie para obter descrição
async function getPokemonSpecies(id) {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/pokemon-species/${id}`);
        if (!response.ok) throw new Error('Espécie não encontrada');

        const species = await response.json();

        // Pega a descrição em português
        const flavorText = species.flavor_text_entries.find(
            entry => entry.language.name === 'pt-BR' || entry.language.name === 'en'
        );

        return flavorText?.flavor_text.replace(/\f/g, ' ') || 'Informação não disponível.';

    } catch (error) {
        console.error('Erro ao buscar espécie:', error);
        return 'Informação não disponível.';
    }
}

// Funções principais

// Busca dados de um único pokémon
async function fetchPokemon(id) {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/pokemon/${id}`);

        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }

        const pokemon = await response.json();

        // Busca descrição em paralelo
        const description = await getPokemonSpecies(id);

        return { ...pokemon, description };

    } catch (error) {
        console.error(`Erro ao buscar Pokémon ${id}:`, error);
        return null;
    }
}

// Busca múltiplos pokémons em paralelo (muito mais rápido)
async function fetchPokemonBatch(start, end) {
    const promises = [];

    for (let i = start; i <= end; i++) {
        promises.push(fetchPokemon(i));
    }

    const results = await Promise.all(promises);
    return results.filter(pokemon => pokemon !== null);
}

// Cria o HTML do card dos pokémons
function createPokemonCard(pokemon) {
    const { id, name, types, sprites } = pokemon;

    const formattedName = capitalize(name);
    const formattedNumber = formatPokemonNumber(id);
    const color = getTypeColor(types);
    const imageUrl = sprites.other['official-artwork'].front_default || sprites.front_default;


    const card = document.createElement('article');
    card.classList.add('pokemon');
    card.style.setProperty('--card-border-color', color);
    card.dataset.name = name.toLowerCase();
    card.dataset.id = id;

    card.innerHTML = `
        <div class="pokemon-inner">
            <div class="imgContainer">
                <img
                    src="${imageUrl}"
                    alt="${formattedName}"
                    loading="lazy"
                >
            </div>
            <div class="info">
                <div class="info-header">
                    <span class="number">${formattedNumber}</span>
                    <div class="info-icon">
                        <img src="assets/images/favicon.png" alt="Salvar pokémon">
                    </div>
                </div>
                <h3 class="name">${formattedName}</h3>
                <button class="btn-more" aria-label="Ver mais sobre ${formattedName}">
                    VER MAIS
                </button>
            </div>
        </div>
    `;

    // Event listener para o botão "VER MAIS"
    const btnMore = card.querySelector('.btn-more');
    btnMore.addEventListener('click', (e) => {
        e.stopPropagation();
        showPokemonDetails(pokemon);
    });

    // Event listener para o card inteiro
    card.addEventListener('click', () => {
        showPokemonDetails(pokemon);
    });

    return card;
}

// Renderiza os pokémons na tela
function renderPokemons(pokemons) {
    // Limpa container
    pokeContainer.innerHTML = '';

    if (pokemons.length === 0) {
        pokeContainer.innerHTML = '<p class="no-results" role=status>Nenhum pokémon encontrado 😢</p>';
        return;
    }

    // Anuncia quantos resultados foram encontrados
    const announcement = document.createElement('div');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = `${pokemons.length} pokémons encontrados`;
    pokeContainer.appendChild(announcement);

    // Adiciona cards
    const fragment = document.createDocumentFragment();
    pokemons.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        fragment.appendChild(card);
    });

    pokeContainer.appendChild(fragment);
}

// Mostra indicador de carregamento
function showLoading() {
    isLoading = true;
    pokeContainer.innerHTML = '<div class="loading">Carregando Pokémons</div>';
}

// Carrega todos os pokémons em lotes
async function loadAllPokemons() {
    showLoading();

    try {
        allPokemons = [];

        // Carrega em lotes para melhor UX
        for (let i = 1; i <= CONFIG.pokemonCount; i += CONFIG.batchSize) {
            const end = Math.min(i + CONFIG.batchSize - 1, CONFIG.pokemonCount);
            const batch = await fetchPokemonBatch(i, end);

            allPokemons = [...allPokemons, ...batch];

            // Renderiza cada lote assim que carrega
            renderPokemons(allPokemons);
        }

        console.log(`✅ ${allPokemons.length} Pokémons carregados com sucesso!`);

    } catch (error) {
        console.error('Erro ao carregar Pokémons:', error);
        pokeContainer.innerHTML = '<p class="error">Erro ao carregar Pokémons. Tente novamente.</p>';

    } finally {
        isLoading = false;
    }
}

// Filtra pokémons na pesquisa
function filterPokemons(searchItem) {
    const term = searchItem.toLowerCase().trim();

    if (!term) {
        renderPokemons(allPokemons);
        return;
    }

    const filtered = allPokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(term) ||
        pokemon.id.toString().includes(term)
    );

    renderPokemons(filtered);
}

// Event listeners

// Pesquisa com debounce para melhor performance
let searchTimeout;
searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        filterPokemons(e.target.value);
    }, 300);
});

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadAllPokemons();
});

// Menu Mobile Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});