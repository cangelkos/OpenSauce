import React, { Component } from 'react';

import RecipeDescription from './RecipeDescription'
import RecipeIngredientsList from './RecipeIngredientsList'
import RecipeCreator from './RecipeCreator'
import RecipeDirections from './RecipeDirections'

const ViewRecipe = ({recipe}) => {
	if (recipe){
  return (
    <div>
   <RecipeDescription recipeDescription={recipe.description} />
   <RecipeCreator recipeCreator={recipe.creator}/>
   <RecipeIngredientsList recipeIngredients={recipe.ingredients}/>
   <RecipeDirections recipeDirections={recipe.directions}/>

    
    </div>
  );
}

return ''
}

export default ViewRecipe;




