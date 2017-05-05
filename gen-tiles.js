'use strict';

var fs = require('fs');
var geojsonvt = require('geojson-vt');
var vtpbf = require('vt-pbf');


module.exports = genTiles;

if (require.main === module) { // if called directly
  genTiles(JSON.parse(fs.readFileSync('./nmprecincts_08.geojson')))
  //var result = genTiles(JSON.parse(fs.readFileSync(process.argv[2])), process.argv[3], process.argv[4]);
  // console.log(JSON.stringify(result));
}

function genTiles(data) {
  const tilesPath = 'nmprecincts'

  var index = geojsonvt(data, {
    indexMaxZoom: 15, //maxZoom || 0,
    tolerance: 1, // simplification tolerance (higher means simpler)
    indexMaxPoints: 30,
    solidChildren: true,
    buffer: 128,
    debug: 1
  });

  var output = {};

  for (var id in index.tiles) {
    var tile = index.tiles[id];
    var z = Math.log(tile.z2) / Math.LN2;
    var tile2 = index.getTile(z, tile.x, tile.y)
    var buff = vtpbf.fromGeojsonVt({'geojsonLayer': tile2})
    var zPath = `./${tilesPath}/${z}`
    var xPath = `./${tilesPath}/${z}/${tile.x}`
    if (!fs.existsSync(`./${tilesPath}`)) fs.mkdirSync(`./${tilesPath}`)
    if (!fs.existsSync(zPath)) fs.mkdirSync(zPath)
    if (!fs.existsSync(xPath)) fs.mkdirSync(xPath)

    fs.writeFileSync(`./${tilesPath}/${z}/${tile.x}/${tile.y}.pbf`, buff);
  }

}
