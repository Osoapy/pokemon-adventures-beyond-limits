/* DECLARING IMPORTS */
import * as htmlMaker from './elementFunctions.js';
import * as fetch from './fetchFunctions.js';

/* DECLARING CLASSES */
import * as pokemonClass from './pokemon.js';
// name, nickname, level, attributes, ability, nature, ivs, evs, item, moves, types, weight, height, hapiness, friendship, isShiny, cries
import * as trainerClass from './trainer.js';
// name, nature, confidence, player, HP, WILL, money, concept, xp, age, rank, image, itens, badges, pokemons, attributes

/* GLOBAL VARIABLES */
let trainerList = {};

/* DECLARING FUNCTIONS */
function getNatureEffect(nature) {
  const natures = {
    "Adamant": [2, 4],  // Attack+, Sp Atk-
    "Bold": [3, 2],     // Defense+, Attack-
    "Brave": [2, 6],    // Attack+, Speed-
    "Calm": [5, 2],     // Sp Def+, Attack-
    "Careful": [5, 4],  // Sp Def+, Sp Atk-
    "Gentle": [5, 3],   // Sp Def+, Defense-
    "Hardy": [0, 0],    // Neutral
    "Hasty": [6, 3],    // Speed+, Defense-
    "Impish": [3, 4],   // Defense+, Sp Atk-
    "Jolly": [6, 4],    // Speed+, Sp Atk-
    "Lax": [3, 5],      // Defense+, Sp Def-
    "Lonely": [2, 3],   // Attack+, Defense-
    "Mild": [4, 3],     // Sp Atk+, Defense-
    "Modest": [4, 2],   // Sp Atk+, Attack-
    "Naive": [6, 5],    // Speed+, Sp Def-
    "Naughty": [2, 5],  // Attack+, Sp Def-
    "Quiet": [4, 6],    // Sp Atk+, Speed-
    "Quirky": [0, 0],   // Neutral
    "Rash": [4, 5],     // Sp Atk+, Sp Def-
    "Relaxed": [3, 6],  // Defense+, Speed-
    "Sassy": [5, 6],    // Sp Def+, Speed-
    "Serious": [0, 0],  // Neutral
    "Timid": [6, 2]     // Speed+, Attack-
  };

  return natures[nature] || [0, 0]; // Returns 0 0 if the nature is not found
}

function createPlayer(trainer) {
    // MAKE THE HTML PART
    htmlMaker.createPlayer(trainer.name, trainer.image);

   // ADD THE PLAYER TO THE LOCALSTORAGE
    let serializedObject = JSON.stringify(trainer); 
    let index = Object.keys(trainerList).length;
    trainer["index"] = index;
    localStorage.setItem(`object${index}`, serializedObject);

    // ADDING THE LOG FUNCTION TO THE PLAYER IMG
    let button = document.getElementById(`player${trainer._name}Button`);
    button.onclick = function() {
        htmlMaker.changePlayerToken(trainer);
        console.log(trainerList[trainer._name]); // LOG
    }

    console.log("Creating the player " + trainer.name + "!"); // LOG
    console.log(trainer); // LOG

    // ADDING TO THE LIST
    trainerList[trainer.name] = trainer;
}

function readTrainer(trainer) {
    console.log("Reading the trainer " + trainer._name); // LOG
    console.log(trainer); // LOG

    // MAKING THE HTML PART
    htmlMaker.createPlayer(trainer._name, trainer._image);
  
    // ADDING THE PLAYER TO THE LIST
    trainerList[trainer._name] = trainer;

    // ADDING THE LOG FUNCTION TO THE PLAYER IMG
    let button = document.getElementById(`player${trainer._name}Button`);
    button.onclick = function() {
        htmlMaker.changePlayerToken(trainer);
        console.log(trainerList[trainer._name]); // LOG
    }

    // ADDING THE POKEMONS TO THE HTML
    for(let k = 0; k < trainer._pokemons.length && trainer._pokemons[0] != null; k++) {
        createPokemon(trainer, trainer._pokemons[k], k + 1);
    }
}

function updateTrainer(trainer) {
    // UPDATE THE LOCALSTORAGE INSTANCE OF THE TRAINER
    let serializedObject = JSON.stringify(trainer); 
    localStorage.setItem(`object${trainer.index}`, serializedObject);
}

async function createPokemon(trainer, pokemon, position) {
    // ADJUSTING THE INDEX
    position--;
    pokemon.index = position;

    // FETCH ITS DATA
    let data = fetch.Data(pokemon.name.toLowerCase())
    .then(data => {
        console.log("Creating the pokemon " + pokemon.name + " of the player " + trainer._name + "!"); // LOG
        console.log(data); // LOG

        // IF IT'S A SHINY POKEMON, PICK IT'S SHINY SPRITE, ELSE, PICK IT'S NORMAL SPRITE
        let img = document.getElementById(`player${trainer._name}TeamImage${position}`);
        if(pokemon.isShiny == 1) {
            fetch.alterImgSrc(img, data.sprites.front_shiny);
        }
        else {
            fetch.alterImgSrc(img, data.sprites.front_default);
        }

        // INSERT IN THE OBJECT POKEMON ITS CRIES, ATTRIBUTES, TYPES, WEIGHT & HEIGHT
        pokemon.cries = data.cries.latest;
        let attributes = [];
        for (let i = 0; i < data.stats.length; attributes.push(data.stats[i].base_stat), i++) {
        }
        pokemon.attributes = attributes;
        for(let i = 0; i < attributes.length; i++) {
                // IF
                if(attributes == 0) {
                    // ELSE
                    attributes[i] = Math.floor(0.01 * (2 * attributes[i] + pokemon.iv[i] + Math.floor(0.25 * pokemon.ev[i])) * pokemon.level) + pokemon.level + 10;
                    // IF
                    if (pokemon.name == "Shedinja") {
                        attributes[i] = 1;
                    }
                }
                // ELSE
                Math.floor(0.01 * (2 * attributes[i] + pokemon.ivs[i] + Math.floor(0.25 * pokemon.evs[i])) * pokemon.level) + 5;
        }
        switch(getNatureEffect(pokemon.nature)[1]) {
            case 2:
                pokemon.attributes[2] = Math.floor(pokemon.attributes[2] * 1.1);
                break;
            
            case 3:
                pokemon.attributes[3] = Math.floor(pokemon.attributes[3] * 1.1);
                break;
            case 4:
                pokemon.attributes[4] = Math.floor(pokemon.attributes[4] * 1.1);
                break;
            case 5:
                pokemon.attributes[5] = Math.floor(pokemon.attributes[5] * 1.1);
                break;
            case 6:
                pokemon.attributes[6] = Math.floor(pokemon.attributes[6] * 1.1);
                break;
        }
        switch(getNatureEffect(pokemon.nature)[2]) {
            case 2:
                pokemon.attributes[2] = Math.floor(pokemon.attributes[2] * 0.9);
                break;

            case 3:
                pokemon.attributes[3] = Math.floor(pokemon.attributes[3] * 0.9);
                break;
            case 4:
                pokemon.attributes[4] = Math.floor(pokemon.attributes[4] * 0.9);
                break;
            case 5:
                pokemon.attributes[5] = Math.floor(pokemon.attributes[5] * 0.9);
                break;
            case 6:
                pokemon.attributes[6] = Math.floor(pokemon.attributes[6] * 0.9);
                break;
        }
        let types = [];
        for (let i = 0; i < data.types.length; types.push(data.types[i].type.name), i++) {}
        console.log("Pokemon types are: " + types); // LOG
        pokemon.types = types;
        pokemon.weight = data.weight/10;
        pokemon.height = data.height/10;
        console.log(trainerList[trainer._name]); // LOG
        console.log(pokemon); // LOG

        // CHANGE THE IMAGE BACKGROUND BASED ON THE POKEMON FIRST TYPE
        htmlMaker.changeType(img.parentNode, pokemon.types[0]);

        // IF THE BUTTON IS PRESSED LOG THE POKEMON
        let botao = document.getElementById(`player${trainer._name}TeamButton${position}`);
        botao.onclick = function() {
            console.log(trainerList[trainer._name]._pokemons[position]); // LOG
            htmlMaker.createPokemon(trainer, trainerList[trainer._name]._pokemons[position])
        }

        // NOW, SAVE IT
        trainerList[trainer._name]._pokemons[position] = pokemon;
        updateTrainer(trainer);
        console.log("The trainer " + trainer._name + " has been saved!"); // LOG
    }).catch(error => {
        console.error(error);
    })
}

// name, nature, confidence, player, HP, WILL, money, concept, xp, age, rank, image, itens, badges, pokemons, attributes, skills, qualities
let trainer = new trainerClass.Trainer("Jhonny Tail, é isso aí", "Bold", 9, "Bebel", 25, 4, 680, "Fotógrafo", 0, 13, "Beginner", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLu64GywifUB9hi5ydUFnFn-9BPn1_j67jtg&s", ["pokeball x3", "mochila", "câmera", "cartas", "pokedex", "gancho de alpinismo", "roupa de trapper", "potion x2"], ["Sunflower"], [], [1,2,1,2], [0,1,1,0,1,1,0,0,1,0,0,0,0,0,0,0], [1, 2, 1, 1, 2]);
createPlayer(trainer);
//name, gender, nickname, level, attributes, ability, nature, ivs, evs, item, moves, types, weight, height, hapiness, friendship, isShiny, cries
let pokemon1 = new pokemonClass.Pokemon("Aipom", "M", "Polaroid", 16, null, "Skill Link", "Jolly", [31, 31, 31, 31, 31, 31], [6, 252, 0, 252, 0, 0], null, ["Sand Attack", "Rain Dance", "Tickle", "Astonish"], null, null, null, 100, 100, 0, null);
createPokemon(trainer, pokemon1, 1);
let pokemon2 = new pokemonClass.Pokemon("Ivysaur", "F", "Leica", 17, null, "Overgrow", "Brave", [31, 31, 31, 31, 31, 31], [6, 252, 0, 252, 0, 0], null, ["Sleep Powder", "Poison Powder", "Solar Beam", "Razor Leaf"], null, null, null, 100, 100, 0, null);
createPokemon(trainer, pokemon2, 2);

function reloadPage() {
    // READ EVERY OBJECT/PLAYER IN THE LOCALSTORAGE
    for(let k = 0; ; k++){
        let serializedObject = localStorage.getItem(`object${k}`);
        if (serializedObject){
                let object = JSON.parse(serializedObject);
                if (!trainerList[object._name]) {
                        readTrainer(object);
                }
        }
        else {
            break;
        }
    }
}

window.addEventListener("beforeunload", function() { 
    localStorage.setItem("reloadedPage", "true");
});
window.addEventListener("load", function() {
    if (localStorage.getItem("reloadedPage") === "true") {
        reloadPage();
        localStorage.removeItem("reloadedPage");
    }
});