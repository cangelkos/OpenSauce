const recipeModel = require('../models/recipe.js');
const userFunctions = require('./userFunctions.js');
const axios = require('axios');
const scrapeIt = require('scrape-it');

const xPorts = {};

///////////////////////////////////////////////////////////
/////                                                 /////
/////     supported site scraping functions           /////
/////                                                 /////
///////////////////////////////////////////////////////////

xPorts.scrapeRecipe = function(url){
if (url.indexOf('epicurious') !== -1) {
    return xPorts.scrapeEpicurious(url)
  } 
 else if (url.indexOf('foodnetwork') !== -1) {
    return xPorts.scrapeFoodNetwork(url)
}
else if (url.indexOf('allrecipes') !== -1){
    return xPorts.scrapeAllRecipes(url)
}
}
//parse the html and return a recipe object
// that is returned from a get request to epicurious
///TODO: change this to accept url and parse epicurious  stuff w/ scrape-it
xPorts.scrapeEpicurious = function (url) {
    console.log('scrapeEpicurious ', url)
    return scrapeIt( url, {
    title: 'div.title-source h1',
    ingredients: {
      listItem: 'li.ingredient'
    },
    directions: {
      listItem: 'li.preparation-step'
    },
    description: 'div.dek p'
  })
  .then(recipeObj => {
    return recipeObj
  });
}

// receives FULL url to do parsing
xPorts.scrapeFoodNetwork = function (url) {
  return scrapeIt( url, {
    title: "head title",
    ingredients: {
      listItem: 'div.ingredients ul li'
    },
    directions: {
      listItem: 'ul.recipe-directions-list li'
    }
  })
  .then(recipeObj => {
    return recipeObj
  });
};

xPorts.scrapeAllRecipes = function (url) {
    return scrapeIt( url, {
    title: 'h1.recipe-summary__h1',
    ingredients: {
      listItem: 'span.recipe-ingred_txt'
    },
    directions: {
      listItem: 'span.recipe-directions__list--item'
    },
    description: 'div.submitter__description'
  })
  .then(recipeObj => {
    console.log("INGREDIENTS BEFORE________", recipeObj.ingredients)
    for(var i = 0; i < recipeObj.ingredients.length; i++){
        if(recipeObj.ingredients[i] === 'Add all ingredients to list'){
            var ingredients = []
            ingredients = recipeObj.ingredients.slice(0, i)
            recipeObj.ingredients = ingredients;
            break
        }
    }

    for(var i = 0; i < recipeObj.directions.length; i++){
        if(typeof recipeObj.directions[i] === 'object'){
            var directions = []
            directions = recipeObj.directions.slice(0, i)
            recipeObj.directions = directions;
            break
        }
    }
    return recipeObj;
  })
}

module.exports = xPorts;

 // DON't DELETE -
 //  - Todo: work on dynamic way to match domain name with function name
 //    Example: getSiteName(https://www.google.com) 
 //        ==> return google 
 //        ==> getFunctionName(google) 
 //        ==> calls scrapeGoogle()

 //  xPorts.parseSiteNameFromUrl = function (url) {
 //    // if statement to see if there is anything before the sitename
 //    // http://www OR https://www OR www will all be followed by
 //    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^\/:]+)/i);
 //    if ( match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
 //     return match[2];
 //    }
 //    else {
 //        return null;
 //    }

 //  }


/* old epicurious scraper
  // newHtml = html.data.replace(/(\r\n|\n|\r)/gm, "");

    // var recipe = {}

    // var pullTitle = newHtml.match(/<h1 itemprop="name">(.*?)\</g);
    // var titleArray = []
    // pullTitle.forEach(function(title) {
    //     titleArray.push(title.match(/<h1 itemprop="name">(.*?)\</).pop())
    // })
    // recipe.title = titleArray[0]

    // var pullDescription = newHtml.match(/itemprop="description"><p>(.*?)\</g);
    // var descriptionArray = []
    // pullDescription.forEach(function(description) {
    //     descriptionArray.push(description.match(/itemprop="description"><p>(.*?)\</).pop())
    // })
    // recipe.description = descriptionArray[0]

    // var ingredients = newHtml.match(/\<li class="ingredient" itemprop="ingredients">(.*?)\</g);
    // var ingredientsArray = []
    // ingredients.forEach(function(ingredient) {
    //     ingredientsArray.push(ingredient.match(/\<li class="ingredient" itemprop="ingredients">(.*?)\</).pop())
    // })
    // recipe.ingredients = ingredientsArray

    // var pullDirections = newHtml.match(/\<li class="preparation-step">(.*?)\</g);
    // var directionsArray = []
    // pullDirections.forEach(function(direction) {
    //     directionsArray.push(direction.match(/\<li class="preparation-step">(.*?)\</).pop())
    // })
    // recipe.directions = directionsArray.join(' ')

    // return recipe
*/