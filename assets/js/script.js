const listaPokemon = [
    { nome: "Pokemon 1", tipo: ["Planta", "Água"], nivel: 25, hp: 10, imagem: "url_da_imagem" },
    { nome: "Pokemon 2", tipo: ["Planta", "Água"], nivel: 25, hp: 10, imagem: "url_da_imagem" }
];

const listaPokemonJson = JSON.stringify(listaPokemon);
const listaPokemonParse = JSON.parse(listaPokemonJson);

console.log(listaPokemonJson);
console.log(listaPokemonParse);

const detalhePokemon = {
    nome: "Teste",
    descricao: "Descrição teste",
    imagem: "url_da_imagem"
};

const detalhePokemonJson = JSON.stringify(detalhePokemon);
const detalhePokemonObjeto = JSON.parse(detalhePokemonJson);
console.log(detalhePokemonObjeto);

const cards = [
    {
        id: 1,
        nome: "Pikachu",
        tipo: ["Elétrico"],
        imagem: "pikachu.png",
        raridade: "Normal",
        poder: 55,
        vida: 120
    },
    {
        id: 2,
        nome: "Charizard",
        tipo: ["Fogo", "Voador"],
        imagem: "charizard.png",
        raridade: "Normal",
        poder: 95,
        vida: 180
    }
];

const lendarios = [
    {
        id: 3,
        nome: "Mewtwo",
        tipo: ["Psíquico"],
        imagem: "mewtwo.png",
        raridade: "Lendário",
        poder: 130,
        vida: 220
    },
    {
        id: 4,
        nome: "Moltres",
        tipo: ["Fogo", "Voador"],
        imagem: "moltres.png",
        raridade: "Lendário",
        poder: 125,
        vida: 200
    }
];

const descricao = {
    nome: "Mewtwo",
    categoria: "Genético",
    altura: { valor: 2.0, unidade: "m" },
    peso: { valor: 122, unidade: "kg" },
    sexo: "Desconhecido",
    golpes: ["Psíquico", "Telecinese", "Raio de Gelo", "Bola Sombria"],
    historia:
        "Mewtwo foi criado em laboratório a partir do DNA do Mew. Ele possui poderes psíquicos imensuráveis e é considerado um dos Pokémon mais poderosos do mundo."
};

const favoritos = [
    { id: 1, nome: "Pikachu", raridade: "Normal" },
    { id: 3, nome: "Mewtwo", raridade: "Lendário" }
];