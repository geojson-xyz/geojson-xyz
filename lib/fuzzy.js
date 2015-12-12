var fuzzy = require('fuzzy'),
  files = require('geojson-xyz-data')['naturalearth-3.3.0'].files;

module.exports = function(search) {
  return fuzzy.filter(search, files, {
      extract: function(item) {
          return item.name + item.category;
      }
  })[0];
};
