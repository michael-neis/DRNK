
const API_KEY = 9973533;

const BASE_API_URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const FILTER_BY_INGREDIENT = 'filter.php?i='; //This requires an ingredient to be appended after the 'i='

const QUERY_BY_ID = `lookup.php?i=`; //This endpoint requires the cocktail id after 'i=' to complete the query

const spiritsList = [];
const liqueursList = [];
const mixersList = [];

//HTML targets
const hardSpiritsField = document.getElementById('hardSpirits');
const liqueursField = document.getElementById('liqueurs');
const mixersField = document.getElementById('mixers');
const theForm = document.getElementById('alcoholSelection');
const drinksListNavBar = document.getElementById('drinksList');
//process flag
let updateListFlag = false;

//Add event listeners
theForm.addEventListener('submit', formHandler);

//Event handlers
async function checkSpiritsFieldValue() {
    if (hardSpiritsField.value.length > 0 && !spiritsList.includes(hardSpiritsField.value) && !liqueursList.includes(hardSpiritsField.value) && !mixersList.includes(hardSpiritsField.value)) {
        console.log("logging spirits entry");
        spiritsList.push(hardSpiritsField.value);
        TESTfetchCocktailsByIngredient(hardSpiritsField.value, possibleDrinksFromSpirits);
        updateListFlag = true;
    } else {
        console.log("spirits field empty");
    }
}

function checkliqueursFieldValue() {
    if (liqueursField.value.length > 0  && !liqueursList.includes(liqueursField.value) && !spiritsList.includes(liqueursField.value) && !mixersList.includes(liqueursField.value)) {
        console.log("logging liqueur entry");
        liqueursList.push(liqueursField.value);
        TESTfetchCocktailsByIngredient(liqueursField.value, possibleDrinksFromLiqueurs)
        .then(() => console.log("Fetched cocktails by ingredient, then waited."));
        updateListFlag = true;
        } else {
        console.log("liqueurs field empty");
    }
}

function checkMixersFieldValue() {
    if (mixersField.value.length > 0 && !mixersList.includes(mixersField.value) && !spiritsList.includes(mixersField.value) && !liqueursList.includes(mixersField.value)) {
        console.log("logging mixer entry");
        mixersList.push(mixersField.value);
        TESTfetchCocktailsByIngredient(mixersField.value, possibleDrinksFromMixers);
        updateListFlag = true;
    } else {
        console.log("mixer field empty");
    }
}

function formHandler(e) {
    e.preventDefault();
    checkSpiritsFieldValue();
    checkliqueursFieldValue();
    checkMixersFieldValue();
    e.target.reset();
    //window.setTimeout(renderDrinkList(findLocusOfDrinks(), 1000));
    renderDrinkList(findLocusOfDrinks());
    //updateListFlag = false;
}

function renderDrinkList(listOfDrinks) {
    
    drinksListNavBar.innerHTML = '';
    for (const drinkStr of listOfDrinks) {
        let listEntry = document.createElement('li');
        listEntry.innerText = drinkStr;
        drinksListNavBar.append(listEntry);
    }
}


/* Not very useful endpoints:
- https://www.thecocktaildb.com/api/json/v2/${API_KEY}/list.php?c=list: returns list of drink categories:
    - "Ordinary Drink"
    - "Cocktail"
    - "Milk / Float / Shake"
    - "Other / Unknown"
    - "Cocoa"
    - "Shot"
    - "Coffee / Tea"
    - "Homemade Liquer"
    - "Beer"
    - "Soft Drink / Soda "
- https://www.thecocktaildb.com/api/json/v2/${API_KEY}/list.php?g=list: returns list of glassware categories:
    - "Highball Glass"
    - "Cocktail Glass"
    - "Old-fashioned Glass"
    - "Whiskey Glass"
    - "Collins Glass"
    - "Pousse cafe glass"
    - "Champagne flute"
    - "Whiskey sour glass"
    - "Brandy snifter"
    - "White wine glass"
    - "Nick and Nora Glass"
    - "Hurricane glass"
    - "Coffee mug"
    - "Shot glass"
    - "Jar"
    - "Irish coffee cup"
    - "Punch bowl"
    - "Pitcher"
    - "Pint glass"
    - "Copper mug"
    - "Beer mug"
    - "Margarita/Coupette glass"
    - "Beer pilsner"
    - "Beer glass"
    - "Parfait glass"
    - "Mason jar"
    - "Margarita glass"
    - "martini glass"
    - "Balloon Glass"
- https://www.thecocktaildb.com/api/json/v2/${API_KEY}/list.php?i=list: returns a list of every ingredient ever
- https://www.thecocktaildb.com/api/json/v2/9973533/list.php?a=list: filters based on whether the drink contains alcohol?
*/

let possibleDrinksFromSpirits = [];
let possibleDrinksFromLiqueurs = [];
let possibleDrinksFromMixers = [];


//fetchers
async function fetchCocktailsByIngredient(ingredient) {
    let fetchURL = `${BASE_API_URL}${FILTER_BY_INGREDIENT}${ingredient}`;
    console.log(`THIS IS THE FETCH URL: ${fetchURL}`);
    fetch(fetchURL)
    .then(res => res.json())
    .then(responseObject => ingredientResponseHandler(responseObject));
    
}

async function TESTfetchCocktailsByIngredient(ingredient, arrayToUpdate) {
    let fetchURL = `${BASE_API_URL}${FILTER_BY_INGREDIENT}${ingredient}`;
    console.log(`THIS IS THE FETCH URL: ${fetchURL}`);
    fetch(fetchURL)
    .then(res => res.json())
    .then(responseObject => TESTingredientResponseHandler(responseObject, arrayToUpdate))
    .then(() => findLocusOfDrinks())
    .then(() => console.log("Fetched cocktails by ingredient, found Loci, then logged."));
    
}

async function TESTingredientResponseHandler(objWithArray, arrayToUpdate) {
    if (typeof objWithArray.drinks === 'string') {
        console.log('The ingredient query found no matching drinks');
    } else {
        for (const drinkObj of objWithArray.drinks) {
            console.log(drinkObj);
            console.log("pushing possible drink");
            //console.log(`Possible drink array length (before PUSH): ${arrayToUpdate.length}`);
            arrayToUpdate.push(drinkObj.strDrink);
            //console.log(`Possible drink array length (after PUSH): ${arrayToUpdate.length}`);
        }

    }
}

//DEPRECATED - replaced with TESTingredientResponseHandler
/*function ingredientResponseHandler(objWithArray) {
    for (const drinkObj of objWithArray.drinks) {
        console.log(drinkObj);
        console.log(`Possible drink array length (before PUSH): ${possibleDrinksFromLiquors.length}`);
        possibleDrinksFromLiquors.push(drinkObj);
        console.log(`Possible drink array length (after PUSH): ${possibleDrinksFromLiquors.length}`);
    }
}*/


function findLocusOfDrinks() {
    //FORK 1 - all possibleDrinks have values, find locus of all 3
    if (possibleDrinksFromSpirits.length > 0 && possibleDrinksFromLiqueurs.length > 0 && possibleDrinksFromMixers.length > 0) {
        let locusSpiritsAndLiqueurs = possibleDrinksFromSpirits.filter(drink => possibleDrinksFromLiqueurs.includes(drink));
        let locusSpiLiqMix = locusSpiritsAndLiqueurs.filter(drink => possibleDrinksFromMixers.includes(drink));
        console.log("Locus found for Spirits, Liqueurs, Mixers");
        return locusSpiLiqMix;
    } else if (possibleDrinksFromSpirits.length === 0) { //FORK 2 - this else triggers if at least one array is a 0
        //Enter this if when possibleSpirits is empty
        if (possibleDrinksFromLiqueurs.length === 0) { //spirits empty, liqueurs empty
            console.log("Locus found for empty spirits, empty liqueurs, populated mixers");
            return possibleDrinksFromMixers; //return only remaining array (even if empty)
        } else { //spirits empty, liqueurs > 0, mixers ?
            if (possibleDrinksFromMixers.length === 0) { //spirits empty, liqueurs > 0, mixers empty
                console.log("Locus found for empty spirits, populated liqueurs, empty mixers");
                return possibleDrinksFromLiqueurs;
            } else { //spirits empty, liqueurs > 0, mixers > 0
                let locusLiqueursMixers = possibleDrinksFromLiqueurs.filter(drink => possibleDrinksFromMixers.includes(drink));
                console.log("Locus found for empty spirits, populated liqueurs, populated mixers");
                return locusLiqueursMixers;
            } 
        } //end flow for spirits empty
    } else if (possibleDrinksFromLiqueurs.length === 0) { //possibleSpirits has at least one value, so continue looking for the 0 array
        //enter this if when Spirits > 0, and liqueurs empty
        if (possibleDrinksFromMixers.length > 0) {
            //liqueurs empty, Mixers > 0 & Spirits > 0
            let locusMixerSpirits = possibleDrinksFromMixers.filter(drink => possibleDrinksFromSpirits.includes(drink));
            console.log("Locus found for populated spirits, empty liqueurs, populated mixers");
            return locusMixerSpirits;
        } else { //liqueurs empty, mixers empty, spirits > 0
            console.log("Locus found for populated spirits, empty liqueurs, empty mixers");
            return possibleDrinksFromSpirits; //return only array with values
        }
    } else { //There is a 0 array; Spirits > 0, & liqueurs > 0, so Mixers must be empty
        let locusSpiritsLiqueurs = possibleDrinksFromSpirits.filter(drink => possibleDrinksFromLiqueurs.includes(drink));
        console.log("Locus found for populated spirits, populated liqueurs, empty mixers");
        return locusSpiritsLiqueurs;
    }
}



//DEBUGGING
//console.log(fetchCocktailsByIngredient("vodka"));
//console.log(possibleDrinksFromLiquors);
//let testLiquors = ['vodka', 'rum', 'tequila', 'gin'];
//let testCordials = ['triple sec', 'chambord', 'baileys', 'St. Germain'];
//let testMixers = ['soda water', 'club soda', 'sprite', 'lemonade', 'ginger beer', 'gingerale', 'coke'];


