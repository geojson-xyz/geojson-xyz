var fs = require('fs'),
  fuzzy = require('fuzzy'),
  csv = require('csv-parser'),
  data = require('geojson-xyz-data')['naturalearth-3.3.0'];

var filesByName = {};
data.files.forEach(function (file, i) {
  file.order = i;
  filesByName[file.name] = file;
});

function findMatches (search, callback) {
  var matches = [];
  data.files.forEach(function (file) {
    var match = fuzzy.match(search, file.name + file.category, {});
    if (match) {
      matches.push({
        original: file,
        score: match.score
      });
    }
  });

  fs.stat(data.index, function (err) {
    if (err) { return callback(null, matches); }
    fs.createReadStream(data.index)
    .pipe(csv(['value', 'property', 'files']))
    .on('data', function (row) {
      var match = fuzzy.match(search, row.property + ':' + row.value, {});
      if (match) {
        row.files.split(';').forEach(function (file) {
          matches.push({
            original: filesByName[file],
            score: match.score,
            property: row.property,
            value: row.value
          });
        });
      }
    })
    .on('end', function () {
      matches.sort(function (a, b) {
        var delta = b.score - a.score;
        if (delta) { return delta; }
        return a.original.order - b.original.order;
      });
      return callback(null, matches);
    });
  });
}

module.exports = function (search, callback) {
  findMatches(search, function (err, matches) { callback(err, matches && matches[0]); });
};

module.exports.findMatches = findMatches;
