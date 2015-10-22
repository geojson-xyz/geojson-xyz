var files = require('../data/files.json');
var sizes = require('../data/sizes.json');
var constants = require('./constants');

var naturalEarthSlug = 'naturalearth-3.3.0';
var naturalEarth = files[naturalEarthSlug];
var categories = Object.keys(naturalEarth);

module.exports = function(options) {
  return [
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
          choices: naturalEarth[category][subcategory].map(function(file) {
            return {
              file: file,
              size: sizes[file]
            };
          }).filter(function(file) {
            return options.all || file.size <= constants.MAX_FILESIZE;
          }).map(function(file) {
            return file.file;
          }),
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
};
