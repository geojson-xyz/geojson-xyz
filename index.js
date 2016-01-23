var https = require('https'),
  fuzzy = require('./lib/fuzzy');

function getURL(url, callback) {
  https.get(url, function(res) {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    }).on('end', function () {
      callback(null, JSON.parse(body));
    });
  }).on('error', function(err) {
    callback(err, null);
  });
}

/**
 * @name geojsonXyz
 * @param {string} fileSearch query: either a complete filename or a
 * search term
 * @param {Function} callback called with (err, { file, geojson })
 * @returns {undefined} calls callback
 */
function getGeoJSON(fileSearch, callback) {
  fuzzy(fileSearch, function (err, match) {
    if (!match) return callback('no file matched your query', null);
    getURL(match.original.url, function (err, res) {
      if (err) throw err;
      callback(null, { data: res, file: match.original, match: match });
    });
  });
}

module.exports.getGeoJSON = getGeoJSON;
module.exports.getURL = getURL;
