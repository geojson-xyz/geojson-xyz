var files = require('../files.json');

var naturalEarthSlug = 'naturalearth-3.3.0';
var naturalEarth = files[naturalEarthSlug];
var categories = Object.keys(naturalEarth);

module.exports = [
  {
    type: 'list',
    name: 'category',
    message: 'What do you want?',
    choices: categories
  }].concat(
  categories.map(function(category) {
    return {
      type: 'list',
      name: 'subcategory',
      message: 'And...',
      choices: Object.keys(naturalEarth[category]),
      when: function(answers) { return answers.category === category; }
    };
  }))
  .concat(categories.reduce(function(memo, category) {
    return memo.concat(Object.keys(naturalEarth[category]).map(function(subcategory) {
      return {
        type: 'list',
        name: 'file',
        message: 'What file?',
        choices: naturalEarth[category][subcategory],
        when: function(answers) {
          return answers.category === category && answers.subcategory === subcategory;
        }
      };
    }));
  }, [])).concat(
  {
    type: 'list',
    name: 'output',
    message: 'What kind of output do you want?',
    choices: ['Download GeoJSON', 'URL to Clipboard']
  });
