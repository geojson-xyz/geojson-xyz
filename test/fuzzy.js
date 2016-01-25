var test = require('tap').test;
var fuzzy = require('../lib/fuzzy');

test('search finds filenames', function (t) {
  fuzzy('ocean', function (err, match) {
    t.equal(match.original.name, 'ne_50m_ocean.geojson', 'direct hit');
    t.end();
  });
});

test('search finds file by feature name', function (t) {
  fuzzy('maryland', function (err, match) {
    t.equal(match.value.toLowerCase(), 'maryland', 'find feature');
    t.end();
  });
});

