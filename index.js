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
  var file = fuzzy(fileSearch);
  if (!file) return callback('no file matched your query', null);
  getURL(file.original.url, function (err, res) {
      if (err) throw err;
      callback(null, { data: res, file: file.original });
  });
};

module.exports.getGeoJSON = getGeoJSON;
module.exports.getURL = getURL;
