const URL = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

getCocktail()

async function getCocktail() {

    var cocktail = {
        name: "",
        img: "",
        instructions: "",
        ingredients: []
    }

    fetch(URL).then((data) => data.json().then((jsonData) => {
        var drink = jsonData.drinks[0];
        console.log("json recieved")
        console.log(drink);

        // get the name, img, and instructions
        cocktail.name = drink.strDrink
        cocktail.img = drink.strDrinkThumb;
        cocktail.instructions = drink.strInstructions;

        // get all of the ingredients
        var i = 0;
        while (drink["strIngredient" + (i + 1)]){
            cocktail.ingredients[i] = drink["strIngredient" + (i + 1)];
            i++
        }

        // get all of the measures
        var measures = [];
        i = 0;
        while (drink["strMeasure" + (i + 1)]){
            measures[i] = drink["strMeasure" + (i + 1)];
            i++
        }

        console.log("measures:")
        console.log(measures)

        // put the measures in front of the ingreidents
        for (i = 0; i < measures.length; i++){
            cocktail.ingredients[i] = measures[i] + cocktail.ingredients[i];
        }

        console.log("returned value:")
        console.log(cocktail)
        return cocktail;
    }))
}

async function buttonClick() {
    var cocktail = await getCocktail();


}