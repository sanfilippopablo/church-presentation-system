// Configuration
var path = require('path');
var defaultPort = 8000;

function getDbPathResolver (environment) {
  return function (mod) {
    return path.join(__dirname, 'db/', mod + '-' + environment + '.db')
  }
}

function fixturePath (mod) {
  return path.join(__dirname, 'db/', mod + '-fixture.db')
}

module.exports = {
  development: {
    port: defaultPort,
    dbPath: getDbPathResolver('development'),
    fixturePath: fixturePath
  },
  test: {
    port: defaultPort,
    dbPath: getDbPathResolver('test'),
    fixturePath: fixturePath
  }
}
