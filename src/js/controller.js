import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

import 'regenerator-runtime/runtime'; // polyfilling async/await
import 'core-js/stable'; // polyfilling everything else from es6 features

// https://forkify-api.herokuapp.com/v2  => API

///////////////////////////////////////

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    // Get recipe id from hash
    const id = window.location.hash.slice(1);

    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Load recipe
    await model.loadRecipe(id);

    // Render recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // Render error
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Render spinner
    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsByPage());

    // Render initial paginination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // Render new results
  resultsView.render(model.getSearchResultsByPage(goToPage));

  // Render new pagiation buttons
  paginationView.render(model.state.search);
};

// Publisher-Subscriber Pattern, here init is the Subscriber
const init = function () {
  // Pass the controlRecipes function to the addHandlerRender method to be called when the event is triggered
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();
