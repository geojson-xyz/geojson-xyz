var https = require('https'),
  fuzzy = require('./lib/fuzzy');

var base = 'https://s3.amazonaws.com/geojson-please/';
var naturalEarthSlug = 'naturalearth-3.3.0';

module.exports = function (fileSearch, callback) {
  var file = fuzzy(fileSearch);

  if (!file) return callback('no file matched your query', null);

  var url = base + naturalEarthSlug + '/' + file.original;
  https.get(url, function(res) { 
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      callback(null, {file: file.original, geojson: JSON.parse(body)});
    });
  }).on('error', function(err) {
    callback(err, null);
  });
};