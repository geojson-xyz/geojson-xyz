var https = require('https'),
  fuzzy = require('./lib/fuzzy');

var base = 'https://s3.amazonaws.com/geojson-please/';
var naturalEarthSlug = 'naturalearth-3.3.0';

module.exports = function (fileSearch, callback) {
  var file = fuzzy(fileSearch);

  if (!file) throw new Error('no file matched your query');

  var url = base + naturalEarthSlug + '/' + file.original;
  https.get(url, function(res) { callback(res, file); }).on('error', function(err) {
    throw err;
  });
};