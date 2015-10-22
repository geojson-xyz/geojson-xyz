var fs = require('fs');

/*
fs.readdirSync('./').filter(function(f) {
  return f.match(/geojson$/);
}).forEach(function(f) {

  var geojson = JSON.parse(fs.readFileSync(f));

  geojson.features.forEach(function(feature) {
    // uninherit shapefile limitations
    if (feature.properties.featurecla) {
      feature.properties.featureclass = feature.properties.featurecla;
      delete feature.properties.featurecla;
    }
  });

  fs.writeFileSync(f, JSON.stringify(geojson));
});
*/

fs.writeFileSync('sizes.json', JSON.stringify(
  fs.readdirSync('./').filter(function(f) {
    return f.match(/geojson$/);
  }).reduce(function(memo, f) {
    memo[f] = fs.statSync(f).size;
    return memo;
  }, {}), null, 2));
