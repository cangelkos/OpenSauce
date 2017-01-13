
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

//Redux and async functions
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';

//Components
import EditRecipeIngredient from './components/ViewRecipe/EditRecipeIngredient';
import HeaderNav from './components/HeaderNav/HeaderNav';
import AppHeader from './components/App/AppHeader';
import SaveAndForkButtons from './components/ViewRecipe/SaveAndForkButtons.jsx';
import Footer from './components/Footer/Footer';


class RouteEditRecipe extends Component {
  constructor(props) {
    super(props);

    // state is used to track changes in the editting boxes
    this.state = {
      title: '',
      description: '',
      directions: '',
      notes: '',
      ingredients: [''],
      images: []
    }

    this.recipeData = {};
    this.onDrop = this.onDrop.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this);
    //recipeData is variable that can be set and used for the whole component
    this.onIngredientChange = this.onIngredientChange.bind(this);
    this.removeIngredient   = this.removeIngredient.bind(this);
    this.addNewIngredient   = this.addNewIngredient.bind(this);
    this.spliceBlankIngredients = this.spliceBlankIngredients.bind(this);
  }

  componentWillMount () {
    console.log('ROUTEEDITRECIPE props -- currentRecipe ', this.props.currentRecipe)
    let currentRecipe = this.props.currentRecipe;
    this.setState({
      title: currentRecipe.title,
      description: currentRecipe.description,
      ingredients: currentRecipe.ingredients,
      directions: currentRecipe.directions,
      notes: currentRecipe.notes || 'null',
      forkedParent: currentRecipe.forkedParent || 'none'
    });
  }

  componentWillReceiveProps(nextProps){
    console.log(' componentWillReceiveProps --- this is next props', nextProps)
  }

  //function to track changes in the ingredient text and set it to state
  onIngredientChange(e) {
    let index = e.target.id.split('-')[1]
    let newIngredients = this.state.ingredients.slice()
    newIngredients[index] = e.target.value
    this.setState({ingredients: newIngredients})
  }

  //function to track changes in the ingredient text and set it to state
  addNewIngredient(e) {
    let newIngredients = this.state.ingredients.slice()
    newIngredients.push(e.target.value)
    this.setState({ingredients: newIngredients})
  }

  //function to remove the number of ingredients and set it to state
  removeIngredient(e) {
    let index = e.target.id.split('-')[1]
    let newIngredients = this.state.ingredients.slice()
    newIngredients.splice(index, 1)
    this.setState({ingredients: newIngredients})
  }

  onInputChange(event) {
    //create a case and match it to the element id, update state accordingly
    switch(event.target.id) {
      case 'recipe-title':
        this.setState({title: event.target.value})
        break;
      case 'recipe-description':
        this.setState({description: event.target.value})
        break;
      case 'recipe-directions':
        this.setState({directions: event.target.value})
        break;
      case 'recipe-notes':
        this.setState({notes: event.target.value})
        break;

    }
  }

  // Push out all blank ingredients from this.state.ingredients list
  // only used in onFormSubmit
  spliceBlankIngredients(ingredients){
    let idx = ingredients.indexOf('');
    if (idx === -1){
      return ingredients
    } else {
      ingredients.splice(idx,1)
      return this.spliceBlankIngredients(ingredients)
    }
  }

  onFormSubmit(e) {
    e.preventDefault();
    let newIngredients = this.spliceBlankIngredients(this.state.ingredients);
    let recipe = {
      title: this.state.title,
      description: this.state.description,
      ingredients: newIngredients,
      directions: this.state.directions,
      images: this.state.images[0],
      recipeId: this.props.currentRecipe._id
    }
    //Does the end of this route handle recipe.recipeId?
    $.ajax({
      method: 'POST',
      url: `/api/recipes/${recipe.recipeId}/editrecipe`,
      data: recipe,
      dataType: 'json'
    })
    .catch((err) => {
      console.error('Recipe did not post. Please enter all required information', err);
      alert('Message: ', err)
    })
    .then((recipe) => {
      const path = `/viewrecipe?recipeId=${this.props.currentRecipe._id}`
      //push path to reset react-redux for page
      browserHistory.push(path);
    })
  }

    // Handle the image file upload. This accepts clicking and drag and drop.
  onDrop(acceptedFiles) {
    // This is required for multiple images
      // images: this.state.images.concat(acceptedFiles)
    // This is for single image uploads
    this.setState({
      images: acceptedFiles
    });
  }

  render() {

    return (  
      <div>
        <HeaderNav/>
        <AppHeader title={this.props.currentRecipe.title} notOnHomepage={true}/>
        <div className="row">
          <div className="container view-recipe-container">
          <p>Here you can edit your recipe. Click submit to save your changes.</p>
            <form onSubmit={this.onFormSubmit}>
              <div className="form-group">
                <label htmlFor="" className="w-100">
                  <h3>Recipe Title:</h3>
                  <input
                    className="col-10 form-control"
                    placeholder="Please enter Recipe Name"
                    id="recipe-title"
                    value={this.state.title}
                    onChange={this.onInputChange.bind(this)}
                  />
                </label>
              </div>
              <div className="form-group">
                <h3>Recipe Description:</h3>
                <textarea
                  placeholder="Please enter a description"
                  className="col-10 form-control"
                  id="recipe-description"
                  rows="7"
                  value={this.state.description}
                  onChange={this.onInputChange.bind(this)}
                ></textarea>
              </div>
              <div className="w-100 form-group">
                <h3>Ingredients</h3>
                {
                  this.state.ingredients.map((ingredient, index) => {
                    return (
                      <EditRecipeIngredient
                        key={index}
                        ingredient={this.state.ingredients[index]}
                        index={index}
                        handleIngredientOnChange={this.onIngredientChange}
                        handleRemoveIngredient={this.removeIngredient}
                      />
                    )
                  })
                }
                <button type="button" className="btn btn-secondary" onClick={this.addNewIngredient}>Add New Ingredient</button>
              </div>
              <div className="form-group">
                <h3>Directions: </h3>
                <textarea
                  placeholder="Please enter directions"
                  className="col-10 form-control"
                  id="recipe-directions"
                  rows="7"
                  value={this.state.directions}
                  onChange={this.onInputChange.bind(this)}
                ></textarea>
              </div>
              <div className="form-group">
                <h3>Recipe Notes:</h3>
                <textarea
                  className="col-10 form-control"              
                  placeholder="Please enter your notes about this recipe"
                  id="recipe-notes"
                  row="7"
                  value={this.state.notes}
                  onChange={this.onInputChange.bind(this)}
                ></textarea>
              </div>
              <div className="form-group">
                <h2>Recipe Photo:</h2>
                <Dropzone multiple={false} onDrop={this.onDrop}>
                    {
                      this.state.images.length > 0 
                        ? <div 
                            className="imageUploadBlock" 
                            style={{'backgroundImage': 'url(' + this.state.images[0].preview + ')' }}
                          ></div> 
                        : `Click or drag an image inside of the box to upload.`
                    }
                </Dropzone>
              </div>
              <span className="">
                <button type="submit" className="btn btn-primary">Submit</button>
              </span>
            </form>
          </div>
        </div> 
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    userData: state.userData,
    currentRecipe: state.currentRecipe
  }
}

export default connect(mapStateToProps)(RouteEditRecipe)
