
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
let randomArray = [];



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
const activeIngredients = document.getElementById('activeIngredients');
const resetButton = document.getElementById('resetBtn');
const drinkContainer = document.getElementById('drinkContainer');
const randomBtn = document.getElementById('btnRandomizer');
const inputFields = document.getElementsByClassName('selectors');
const tipsyDrink = document.getElementById('DRNKLogoRot')

const spiritIngredients = document.getElementById('spiritIngredients')
const liqueurIngredients = document.getElementById('liqueurIngredients')
const mixerIngredients = document.getElementById('mixerIngredients')
const ingredientsInputField = document.getElementById('ingredientsInput')


let numDrinks = 200

function increaseTipsiness(){
    numDrinks += 50;
}




//Add event listeners
theForm.addEventListener('submit', formHandler);
resetButton.addEventListener('click', resetParams);
randomBtn.addEventListener('click', randomDrink);


//Event handlers
async function checkInputFieldValue() {
    if (ingredientsInputField.value.length > 0 && !spiritsList.includes(ingredientsInputField.value) && !liqueursList.includes(ingredientsInputField.value) && !mixersList.includes(ingredientsInputField.value)) {
        console.log("logging ingredients entry");
        checkType(ingredientsInputField.value);
        } else {
        console.log("ingredients field empty");
    }
}

function formHandler(e) {
    e.preventDefault();
    checkInputFieldValue();
    e.target.reset();
    clearContainer();
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
    increaseTipsiness()
    tipsyDrink.style.transition= `opacity ${numDrinks}ms`
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


function addToSpiritIngredients(ingredient){
    let word = ingredient.toLowerCase()
    if(spiritIngredients.textContent === "None Selected") {
        spiritIngredients.textContent = ""
        spiritIngredients.append(word)
    } else {
        spiritIngredients.append(`, ${word}`)
    }
}

function addToLiqueurIngredients(ingredient){
    let word = ingredient.toLowerCase()
    if(liqueurIngredients.textContent === "None Selected") {
        liqueurIngredients.textContent = ""
        liqueurIngredients.append(word)
    } else {
        liqueurIngredients.append(`, ${word}`)
    }
}

function addToMixerIngredients(ingredient){
    let word = ingredient.toLowerCase()
    if(mixerIngredients.textContent === "None Selected") {
        mixerIngredients.textContent = ""
        mixerIngredients.append(word)
    } else {
        mixerIngredients.append(`, ${word}`)
    }
}

function resetParams(){
    spiritIngredients.textContent = "None Selected";
    liqueurIngredients.textContent = "None Selected";
    mixerIngredients.textContent = "None Selected";

    spiritsList.length = 0;
    liqueursList.length = 0;
    mixersList.length = 0;

    possibleDrinksFromSpirits.length = 0;
    possibleDrinksFromLiqueurs.length = 0;
    possibleDrinksFromMixers.length = 0;

    theForm.reset()

    while(drinksListNavBar.firstChild ){
        drinksListNavBar.removeChild(drinksListNavBar.firstChild);
      }

    drinkName.textContent = '??? Choose Your Ingredients ???'

    clearContainer()
}

function clearContainer(){
    drinkImage.src = 'https://redheadoakbarrels.com/wp-content/uploads/2018/01/Top_Shelf_Liquors-e1512434197219.jpg'
    allIngredientsList.textContent = ''
    instructionsList.textContent = ''
}



function sortIngredients(obj){
    let ingArray = obj.ingredients;
    let ingObj = ingArray[0];
    let word = ingObj.strIngredient;

    if (ingObj.strAlcohol === 'Yes' && ingObj.strType === 'Liqueur'){
        liqueursList.push(word);
        TESTfetchCocktailsByIngredient(word, possibleDrinksFromLiqueurs);
        addToLiqueurIngredients(word);
    } else if (ingObj.strAlcohol === 'Yes'){
        spiritsList.push(word);
        TESTfetchCocktailsByIngredient(word, possibleDrinksFromSpirits);
        addToSpiritIngredients(word);
    } else {
        mixersList.push(word);
        TESTfetchCocktailsByIngredient(word, possibleDrinksFromMixers);
        addToMixerIngredients(word);
    }
}



//focusFrame targets: drinkName, drinkImage, allIngredientsList, instructionsList
function renderFocusFrame(drinkObj) {
    console.log("you're so close! You're in the focus frame renderer");
    allIngredientsList.innerHTML = '';
    drinkName.innerText = drinkObj.strDrink;
    drinkImage.src = drinkObj.strDrinkThumb;
    let ingredientsMeasuresArr = drinkRatiosHelper(drinkObj);
    for (const valuePairArray of ingredientsMeasuresArr) {
        let ingredientLi = document.createElement('li');
        ingredientLi.innerText = `${valuePairArray[0]}:  ${valuePairArray[1]}`;
        allIngredientsList.append(ingredientLi);
    }
    renderInstructions(drinkObj);
}

function renderInstructions(drinkObj) {
    console.log(`About to render drink instructions for: ${drinkObj.strDrink}`);
    instructionsList.innerHTML = '';
    console.log(`Original instructions: ${drinkObj.strInstructions}`);
    let instructionsArray = drinkObj.strInstructions.split('.');
    for (const instruction of instructionsArray) {
        if (instruction.trim() !== '') {
            let instructionLi = document.createElement('li');
            instructionLi.innerText = instruction;
            instructionsList.append(instructionLi);
        }
    }
}

function drinkRatiosHelper(drinkObj) {
    let ingredientsAndRatios = [];
    let ingredientNameKey = 'strIngredient';
    let ingredientMeasureKey = 'strMeasure';
    for (i=1; i<=15; i++) {
        let ingredientQuery = `${ingredientNameKey}${i}`;
        let measureQuery = `${ingredientMeasureKey}${i}`;
        if (drinkObj?.[ingredientQuery] === null || drinkObj?.[ingredientQuery] === '') {
            console.log("Reached the end of real ingredients/measures.");
            break;
        } else {
            if (drinkObj?.[measureQuery] !== null) {
                console.log(`Pushing ${drinkObj[ingredientQuery]}, ${drinkObj[measureQuery]}`);
                ingredientsAndRatios.push([drinkObj[ingredientQuery], drinkObj[measureQuery]]);
            } else {
                ingredientsAndRatios.push([drinkObj[ingredientQuery], 'to taste']);
            }
        }
    }
    console.log("Object mapped, ingredients and ratios stored safely.");
    return ingredientsAndRatios;
}


function randomDrink (){
    randomArray.length = 0;
    fetch(`${BASE_API_URL}/randomselection.php`)
    .then(resp => resp.json())
    .then(drinks => handleRandom(drinks.drinks))
}

function handleRandom(drinks){
    resetParams()
    drinkName.textContent = '??? Select Your Drink'
    drinks.forEach(drink => randomArray.push(drink.strDrink))
    renderDrinkList(randomArray)
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
    .then(responseObject => TESTingredientResponseHandler(responseObject, arrayToUpdate, ingredient))
    .then(() => findLocusOfDrinks())
    .then(() => console.log("Fetched cocktails by ingredient, found Loci, then logged."))
    .then(() => renderDrinkList(lociList))
    .then(() => console.log("Rendered drink list, THEN logged this."));
}

async function TESTingredientResponseHandler(objWithArray, arrayToUpdate, ingredient) {
    if (typeof objWithArray.drinks === 'string') {
        console.log('The ingredient query found no matching drinks');
    } else {
        for (const drinkObj of objWithArray.drinks) {
            console.log(`pushing possible drink: ${drinkObj.strDrink}`);
            arrayToUpdate.push(drinkObj.strDrink);
            console.log(objWithArray)
            }
        drinkName.textContent = '??? Select Your Drink';
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


function checkType(ingredient){
    fetch(`${BASE_API_URL}search.php?i=${ingredient}`)
    .then(resp => resp.json())
    .then(obj => sortIngredients(obj))
}



//DEBUGGING

//nothing to see here right now =D




//Trying out autofill:

const autoFillOptions = []


document.addEventListener('DOMContentLoaded', initFillOptions)


function initFillOptions (){
    fetch(`${BASE_API_URL}/list.php?i=list`)
    .then(res => res.json())
    .then(obj => createFillOptions(obj))
}

function createFillOptions (obj){
    let allArray = obj.drinks
    allArray.forEach(ing => {
        let drinkies = ing.strIngredient1
        autoFillOptions.push(drinkies)
    })
}

function autoFillBoxes (text, array){

    //the variable that will determine what list item we are on
    let selectedWord;

    text.addEventListener('input', function(e) {
        
        // elements to be filled with the value of what is being typed
        let dropDown
        let listItem
        let matchLetters = this.value;

        //makes sure no autofill lists can happen simultaneously
        closeAllLists();

        //stops fill from happening if no value found
        if (!matchLetters) {return false;}

        selectedWord = -1;

        //assigning DIV element to contain values
        dropDown = document.createElement('div');
        dropDown.setAttribute('id', this.id + "selectorsList");
        dropDown.setAttribute('class', 'selectorsItems');

        //appends that element as a child to the auto fill container
        this.parentNode.appendChild(dropDown);

        //checks for items in the array that start with the same letter(s) as typed, as well as applyng BOLD to those letters
        for (let i = 0; i < array.length; i++){
            if (array[i].substr(0, matchLetters.length).toUpperCase() == matchLetters.toUpperCase()){
                listItem = document.createElement('div');
                listItem.innerHTML = "<strong>" + array[i].substr(0, matchLetters.length) + "</strong>";
                listItem.innerHTML += array[i].substr(matchLetters.length);

                //creating a field to hold the value of an item (word) in the array
                listItem.innerHTML += "<input type='hidden' class='thingy' value='" + array[i] + "'>";

                //create an eventlistener for when an item is clicked
                listItem.addEventListener('click', function(e) {

                    //takes the value of the item clicked and inputs it into the text field
                    text.value = this.getElementsByTagName('input')[0].value;

                    selectedWord = -1;

                    //then makes sure to close the list
                    closeAllLists();
                })
                listItem.setAttribute('class', 'autoListOptions')
                dropDown.appendChild(listItem);
            }
        }
    })

    //adding an eventlistener to the keydown
    text.addEventListener('keydown', function(keySpec) {
        let wordsArray = document.getElementById(this.id + "selectorsList");
        if (wordsArray) wordsArray = wordsArray.getElementsByTagName('div');

        //for down arrow, increase focus variable and make item more visible
        if (keySpec.keyCode == 40){
            selectedWord++;
            addActive(wordsArray);

        //for the up arrow, decrease focus variable and make that new selected item more visible
        } else if (keySpec.keyCode == 38){
            selectedWord--;
            addActive(wordsArray);

        //for the enter key, prevent the whole form from being submitted, and simulate a 'click' on the selected item
        } else if (keySpec.keyCode == 13){

            if (selectedWord > -1){
                keySpec.preventDefault();
                if (wordsArray) wordsArray[selectedWord].click();
                selectedWord = -1;
            }

        }
    });

    //creating a function to clasify whether an item is "active"
    function addActive(wordsArray){
        if (!wordsArray) return false;

        //initiate another function to remove all 'active' indications and reseting focus
        removeActive(wordsArray);
        if (selectedWord >= wordsArray.length) selectedWord = 0;
        if (selectedWord < 0) selectedWord = (wordsArray.length - 1);

        //adding a new html class for the active elements
        wordsArray[selectedWord].classList.add('activeSelectors');
    }

    //the actual function to remove the active indications as initiated above
    function removeActive(wordsArray){
        for (let i = 0; i < wordsArray.length; i++){
            wordsArray[i].classList.remove('activeSelectors');
        }
    }

    //the function that actually closes the lists from earlier
    // function closeAllLists(list) {
    //     var dropDown = document.getElementsByClassName("selectorsItems");
    //     console.log(list)
    //     for (var i = 0; i < dropDown.length; i++) {
    //     if (list != dropDown[i] && list != text) {
    //             dropDown[i].parentNode.removeChild(dropDown[i]);
    //         }
    //     }
    // }

    function closeAllLists() {
        var dropDown = document.getElementsByClassName("selectorsItems");
        for (var i = 0; i < dropDown.length; i++) {
                dropDown[i].parentNode.removeChild(dropDown[i]);
            }
        }


    //and finally, an eventlistener so that when the user clicks out of the field, the lists are closed
    document.addEventListener('click', (e) => closeAllLists(e.target))
}



  //initiating it

  autoFillBoxes(ingredientsInputField, autoFillOptions);