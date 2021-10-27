
const API_KEY = 9973533;

const BASE_API_URL = 'https://www.thecocktaildb.com/api/json/v2/9973533/';
const FILTER_BY_INGREDIENT = 'filter.php?i='; //This requires an ingredient to be appended after the 'i='

const QUERY_BY_ID = `lookup.php?i=`; //This endpoint requires the cocktail id after 'i=' to complete the query

const spiritsList = [];
const liqeursList = [];
const mixersList = [];

//HTML targets
const hardSpiritsField = document.getElementById('hardSpirits');
const liqeursField = document.getElementById('liqeurs');
const mixers = document.getElementById('mixers');
const theForm = document.getElementById('alcoholSelection');

//Add event listeners
theForm.addEventListener('submit', formHandler);

//Event handlers
async function checkSpiritsFieldValue() {
    if (hardSpiritsField.value && !spiritsList.includes(hardSpiritsField.value) && !liqeursList.includes(hardSpiritsField.value) && !mixersList.includes(hardSpiritsField.value)) {
        console.log("logging spirits entry");
        spiritsList.push(hardSpiritsField.value);
        TESTfetchCocktailsByIngredient(hardSpiritsField.value, possibleDrinksFromSpirits);
        
        
    } else {
        console.log("spirits field empty");
    }
}

function checkLiqeursFieldValue() {
    if (liqeursField.value && !liqeursList.includes(liqeursField.value) && !spiritsList.includes(liqeursField.value) && !mixersList.includes(liqeursField.value)) {
        console.log("logging liqeur entry");
        liqeursList.push(liqeursField.value);
        TESTfetchCocktailsByIngredient(liqeursField.value, possibleDrinksFromLiqeurs)
        } else {
        console.log("liqeurs field empty");
    }
}

function checkMixersFieldValue() {
    if (mixers.value && !mixersList.includes(mixers.value) && !spiritsList.includes(mixers.value) && !liqeursList.includes(mixers.value)) {
        console.log("logging mixer entry");
        mixersList.push(mixers.value);
        TESTfetchCocktailsByIngredient(mixers.value, possibleDrinksFromMixers);
    } else {
        console.log("mixer field empty");
    }
}

function formHandler(e) {
    e.preventDefault();
    checkSpiritsFieldValue();
    checkLiqeursFieldValue();
    checkMixersFieldValue();
    e.target.reset();


}

//Add listeners


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
let possibleDrinksFromLiqeurs = [];
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
    .then(responseObject => TESTingredientResponseHandler(responseObject, arrayToUpdate));
    
}

async function TESTingredientResponseHandler(objWithArray, arrayToUpdate) {
    if (typeof objWithArray.drinks === 'string') {
        console.log('The ingredient query found no matching drinks');
    } else {
        for (const drinkObj of objWithArray.drinks) {
            console.log(drinkObj);
            console.log(`Possible drink array length (before PUSH): ${arrayToUpdate.length}`);
            arrayToUpdate.push(drinkObj.strDrink);
            console.log(`Possible drink array length (after PUSH): ${arrayToUpdate.length}`);
        }
    }
}


function ingredientResponseHandler(objWithArray) {
    for (const drinkObj of objWithArray.drinks) {
        console.log(drinkObj);
        console.log(`Possible drink array length (before PUSH): ${possibleDrinksFromLiquors.length}`);
        possibleDrinksFromLiquors.push(drinkObj);
        console.log(`Possible drink array length (after PUSH): ${possibleDrinksFromLiquors.length}`);
    }
}

function basicFetch() {
    fetch(`${BASE_API_URL}${FILTER_BY_INGREDIENT}vodka`)
    .then(res => res.json())
    .then(responseObject => console.log(responseObject.drinks));
}

function findLocusOfDrinks() {
    let locusSpiritsAndLiqeurs = possibleDrinksFromSpirits.filter(drink => possibleDrinksFromLiqeurs.includes(drink));
    let locusSpiLiqMix = locusSpiritsAndLiqeurs.filter(drink => possibleDrinksFromMixers.includes(drink));
    return locusSpiLiqMix;
}

//DEBUGGING
//console.log(fetchCocktailsByIngredient("vodka"));
//console.log(possibleDrinksFromLiquors);

let testLiquors = ['vodka', 'rum', 'tequila', 'gin'];
let testCordials = ['triple sec', 'chambord', 'baileys', 'St. Germain'];
let testMixers = ['soda water', 'club soda', 'sprite', 'lemonade', 'ginger beer', 'gingerale', 'coke'];


