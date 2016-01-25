var https = require('https'),
  fuzzy = require('./lib/fuzzy');

/**
 * @name geojsonXyz
 * @param {string} fileSearch query: either a complete filename or a
 * search term
 * @param {object} options
 * @param {Function} callback called with (err, [{ file, score, featureMatch }])
 * @returns {undefined} calls callback
 */
function getGeoJSON(search, options, callback) {
  fuzzy.findMatches(search, function (err, matches) {
    if (!matches.length) return callback('no file matched your query', null);
    var topMatch = matches[0];
    matches = matches.filter(function (match, i) {
      // filter any matches that aren't tied for first place, match-score-wise
      if (!options.all) { return i === 0; }
      return match.score === topMatch.score;
    })
    .map(function (match) {
      // simplify the struct
      return {
        file: match.original,
        featureMatch: match.value ? {
          property: match.property,
          value: match.value
        } : false,
        score: match.score
      };
    })
    .reduce(function (memo, match) {
      // combine multiple matches from the same file, making `featureMatch` into
      // an array of all the ones from that file.
      var previous = memo[match.file.name];
      if (!previous) {
        memo[match.file.name] = match;
        match.featureMatch = match.featureMatch ? [match.featureMatch] : false;
      } else if (previous.featureMatch && match.featureMatch) {
        previous.featureMatch.push(match.featureMatch);
      }
      return memo;
    }, {});

    return callback(null, Object.keys(matches).map(function (k) { return matches[k]; }));
  });
}

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

module.exports.getURL = getURL;
module.exports.getGeoJSON = getGeoJSON;
