require('dotenv').config();

const URL = 'https://api.spoonacular.com';
const URL_RECIPESCOMPLEX = URL + '/recipes/complexSearch';
const URL_RECIPEID = URL + '/recipes';
const DIET_URL = URL + '/types';

module.exports = {
    URL,
    URL_RECIPESCOMPLEX,
    URL_RECIPEID,
    DIET_URL
}



