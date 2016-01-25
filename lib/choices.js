var naturalEarth = require('geojson-xyz-data')['naturalearth-3.3.0'].files;

var categories = Object.keys(naturalEarth.reduce(function (cats, meow) {
  cats[meow.category] = true;
  return cats;
}, {}));

module.exports = function() {
  return [
    {
      type: 'list',
      name: 'category',
      message: 'What do you want?',
      choices: categories
    }]
    .concat(categories.map(function(category) {
      return {
        type: 'list',
        name: 'file',
        message: 'What file?',
        choices: naturalEarth.filter(function (file) {
          return file.category === category;
        }).map(function(file) {
          return {
            name: file.name,
            value: file
          };
        }),
        when: function(answers) {
          return answers.category === category;
        }
      };
    })).concat(
    {
      type: 'list',
      name: 'output',
      message: 'What kind of output do you want?',
      choices: ['Download GeoJSON', 'URL to Clipboard']
    });
};
