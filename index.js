var https = require('https'),
  fuzzy = require('./lib/fuzzy');

/**
 * @name geojsonXyz
 * @param {string} fileSearch query: either a complete filename or a
 * search term
 * @param {Function} callback called with (err, { file, geojson })
 * @returns {undefined} calls callback
 */
module.exports = function (fileSearch, callback) {
  var file = fuzzy(fileSearch);

  if (!file) return callback('no file matched your query', null);

  https.get(file.original.url, function(res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      callback(null, {file: file.original.name, geojson: JSON.parse(body)});
    });
  }).on('error', function(err) {
    callback(err, null);
  });
};
