
//API constants
const API_KEY = 9973533;

const BASE_API_URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const FILTER_BY_INGREDIENT = 'filter.php?i='; //This requires an ingredient to be appended after the 'i='

const QUERY_BY_ID = `lookup.php?i=`; //This endpoint requires the cocktail id after 'i=' to complete the query
const QUERY_BY_DRINK_NAME = `${BASE_API_URL}search.php?s=`;

const spiritsList = [];
const liqueursList = [];
const mixersList = [];
let lociList = [];

//HTML targets
const hardSpiritsField = document.getElementById('hardSpirits');
const liqueursField = document.getElementById('liqueurs');
const mixersField = document.getElementById('mixers');
const theForm = document.getElementById('alcoholSelection');
const drinksListNavBar = document.getElementById('drinksList');
//focusFrame targets: drinkName, drinkImage, allIngredientsList, instructionsList
const drinkName = document.getElementById('drinkName');
const drinkImage = document.getElementById('drinkImage');
const allIngredientsList = document.getElementById('allIngredientsList');
const instructionsList = document.getElementById('instructionsList');

//Add event listeners
theForm.addEventListener('submit', formHandler);

//Event handlers
async function checkSpiritsFieldValue() {
    if (hardSpiritsField.value.length > 0 && !spiritsList.includes(hardSpiritsField.value) && !liqueursList.includes(hardSpiritsField.value) && !mixersList.includes(hardSpiritsField.value)) {
        console.log("logging spirits entry");
        spiritsList.push(hardSpiritsField.value);
        TESTfetchCocktailsByIngredient(hardSpiritsField.value, possibleDrinksFromSpirits);
        } else {
        console.log("spirits field empty");
    }
}

function checkliqueursFieldValue() {
    if (liqueursField.value.length > 0  && !liqueursList.includes(liqueursField.value) && !spiritsList.includes(liqueursField.value) && !mixersList.includes(liqueursField.value)) {
        console.log("logging liqueur entry");
        liqueursList.push(liqueursField.value);
        TESTfetchCocktailsByIngredient(liqueursField.value, possibleDrinksFromLiqueurs);
        } else {
        console.log("liqueurs field empty");
    }
}

function checkMixersFieldValue() {
    if (mixersField.value.length > 0 && !mixersList.includes(mixersField.value) && !spiritsList.includes(mixersField.value) && !liqueursList.includes(mixersField.value)) {
        console.log("logging mixer entry");
        mixersList.push(mixersField.value);
        TESTfetchCocktailsByIngredient(mixersField.value, possibleDrinksFromMixers);
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
}

function renderDrinkList(listOfDrinks) {
    drinksListNavBar.innerHTML = '';
    for (const drinkStr of listOfDrinks) {
        let listEntry = document.createElement('li');
        listEntry.innerText = drinkStr;
        listEntry.addEventListener('click', listClickHandler);
        drinksListNavBar.append(listEntry);
    }
}

function listClickHandler(e) {
    let drinkName = e.target.innerText;
    console.log(`I see your click targeting: ${drinkName}`);
    console.log(`FETCH ADDRESS: ${QUERY_BY_DRINK_NAME}${drinkName}`);
    fetch(`${QUERY_BY_DRINK_NAME}${drinkName}`)
    .then(res => res.json())
    .then(respObj => focusFrameHandler(respObj, drinkName));
}

function focusFrameHandler(drinkRespObj, plainTextName) {
    console.log(`Here's the drink name as plain text: ${plainTextName}`);
    if (drinkRespObj.drinks === null) {
        alert("Something went pretty wrong.");
    } else {
        console.log("about to search response for exact match");
        let responseDrinkList = drinkRespObj.drinks;
        for (const drink of responseDrinkList) {
            console.log(`drink.str value: ${drink.strDrink}`);
            console.log(`comparison value: ${plainTextName}`);
            if (drink.strDrink === plainTextName) {
                console.log("Found exact match");
                renderFocusFrame(drink);                
                break;
            }
        }
    }
}

//focusFrame targets: drinkName, drinkImage, allIngredientsList, instructionsList
function renderFocusFrame(drinkObj) {
    console.log("you're so close! You're in the focus frame renderer");
    drinkName.innerText = drinkObj.strDrink;
    drinkImage.src = drinkObj.strDrinkThumb;
    
    

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
    .then(() => console.log("Fetched cocktails by ingredient, found Loci, then logged."))
    .then(() => renderDrinkList(lociList))
    .then(() => console.log("Rendered drink list, THEN logged this."));
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
    lociList = [];
    //FORK 1 - all possibleDrinks have values, find locus of all 3
    if (possibleDrinksFromSpirits.length > 0 && possibleDrinksFromLiqueurs.length > 0 && possibleDrinksFromMixers.length > 0) {
        let locusSpiritsAndLiqueurs = possibleDrinksFromSpirits.filter(drink => possibleDrinksFromLiqueurs.includes(drink));
        lociList = locusSpiritsAndLiqueurs.filter(drink => possibleDrinksFromMixers.includes(drink));
        console.log("Locus found for Spirits, Liqueurs, Mixers");
        return lociList;
    } else if (possibleDrinksFromSpirits.length === 0) { //FORK 2 - this else triggers if at least one array is a 0
        //Enter this if when possibleSpirits is empty
        if (possibleDrinksFromLiqueurs.length === 0) { //spirits empty, liqueurs empty
            console.log("Locus found for empty spirits, empty liqueurs, populated mixers");
            lociList = [...possibleDrinksFromMixers];
            return lociList; //return only remaining array (even if empty)
        } else { //spirits empty, liqueurs > 0, mixers ?
            if (possibleDrinksFromMixers.length === 0) { //spirits empty, liqueurs > 0, mixers empty
                console.log("Locus found for empty spirits, populated liqueurs, empty mixers");
                lociList = [...possibleDrinksFromLiqueurs];
                return lociList;
            } else { //spirits empty, liqueurs > 0, mixers > 0
                lociList = possibleDrinksFromLiqueurs.filter(drink => possibleDrinksFromMixers.includes(drink));
                console.log("Locus found for empty spirits, populated liqueurs, populated mixers");
                return lociList;
            } 
        } //end flow for spirits empty
    } else if (possibleDrinksFromLiqueurs.length === 0) { //possibleSpirits has at least one value, so continue looking for the 0 array
        //enter this if when Spirits > 0, and liqueurs empty
        if (possibleDrinksFromMixers.length > 0) {
            //liqueurs empty, Mixers > 0 & Spirits > 0
            lociList = possibleDrinksFromMixers.filter(drink => possibleDrinksFromSpirits.includes(drink));
            console.log("Locus found for populated spirits, empty liqueurs, populated mixers");
            return lociList;
        } else { //liqueurs empty, mixers empty, spirits > 0
            console.log("Locus found for populated spirits, empty liqueurs, empty mixers");
            lociList = [...possibleDrinksFromSpirits];
            return lociList; //return only array with values
        }
    } else { //There is a 0 array; Spirits > 0, & liqueurs > 0, so Mixers must be empty
        lociList = possibleDrinksFromSpirits.filter(drink => possibleDrinksFromLiqueurs.includes(drink));
        console.log("Locus found for populated spirits, populated liqueurs, empty mixers");
        return lociList;
    }
}



//DEBUGGING
//console.log(fetchCocktailsByIngredient("vodka"));
//console.log(possibleDrinksFromLiquors);
//let testLiquors = ['vodka', 'rum', 'tequila', 'gin'];
//let testCordials = ['triple sec', 'chambord', 'baileys', 'St. Germain'];
//let testMixers = ['soda water', 'club soda', 'sprite', 'lemonade', 'ginger beer', 'gingerale', 'coke'];
console.log("starting that 'GARBAGE' fetch --- standby");
fetch('https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=garbage')
.then(res => res.json())
.then(obj => console.log((obj.drinks === null)))

