import 'regenerator-runtime/runtime'; // polyfilling async/await
import { API_URL, RES_PER_PAGE } from './config.js';
import { getJSON } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

// Async function -> returns a promise, so you should await for it
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // Check if the recipe is already bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsByPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; // page = 1,  start = 0
  const end = page * state.search.resultsPerPage; // end = 10
  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ingredient => {
    ingredient.quantity *= newServings / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function () {
  // Add bookmark
  state.bookmarks.push(state.recipe);

  // Mark current recipe as bookmarked
  state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = function (id) {
  // Remove bookmark
  state.bookmarks.splice(
    state.bookmarks.findIndex(bookmark => bookmark.id === id),
    1
  );

  // Mark current recipe as not bookmarked
  state.recipe.bookmarked = false;

  persistBookmarks();
};

const persistBookmarks = function () {
  // JSON.stringify => converts an object to a string
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storedBookmarks = localStorage.getItem('bookmarks');

  // JSON.parse => converts the string to an object again
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
};
init();
