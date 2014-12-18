// Configuration
var defaultPort = 8000;

module.exports = {
  development: {
    port: defaultPort,
    connectionString: 'mongodb://localhost/cps-development'
  },
  test: {
    port: defaultPort,
    connectionString: 'mongodb://localhost/cps-test'
  }
}
