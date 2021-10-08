import 'regenerator-runtime/runtime';
import 'core-js/stable';

import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './../js/views/searchView';
import resultView from './../js/views/resultView';
import paginationView from './../js/views/paginationView';
import bookmarksView from './views/bookmarksView';

if (module.hot) {
  module.hot.accept();
}

//RENDERING RESIPE
const controlRecipes = async function () {
  try {
    //geting id from hashchange
    const id = window.location.hash.slice(1);

    if (!id) return;

    //Update results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    //rendering spinner befor loading the resipe
    recipeView.renderSpinner();

    //load resipe from the model
    await model.loadResipe(id);

    // //rendering the current resipe
    recipeView.render(model.state.recipe);

    // recipeView.upade(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const searchResipes = async function () {
  try {
    //getting the name key of the resipe from  searchView
    const query = searchView.getQuery();

    if (!query) return;
    resultView.renderSpinner();
    //loading list of resipes
    await model.loadSearchResults(query);
    // console.log(model.state.search.results);
    resultView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);

    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

const controlPagination = function (page) {
  resultView.render(model.getSearchResultsPage(page));
  paginationView.render(model.state.search);
};

const controlServings = function (numServ) {
  model.updateServings(numServ);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //add/remove recipe bookmarks
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //update recipe view
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(searchResipes);
  paginationView.addHandlerClick(controlPagination);
};

init();

// showRescipes();
// window.addEventListener('load', controlRespies);

// window.addEventListener('load', showRescipes);

//DRY way

// const showResResults = async function () {
//   try {
//     const res = await fetch('https://forkify-api.herokuapp.com/api/v2/');
//     const data = await res.json();
//     console.log(data);
//   } catch (error) {
//     console.log(error);
//   }
// };
// showResResults();
// console.log('TEST');
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////