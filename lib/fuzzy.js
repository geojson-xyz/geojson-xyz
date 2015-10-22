var fuzzy = require('fuzzy'),
  files = require('../files.json')['naturalearth-3.3.0'];

var possibilities = Object.keys(files).reduce(function(memo, category) {
  Object.keys(files[category]).forEach(function(subcategory) {
    memo = memo.concat(files[category][subcategory]);
  });
  return memo;
}, []);

module.exports = function(search) {
  return fuzzy.filter(search, possibilities)[0];
};
