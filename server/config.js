// Configuration
module.exports = {
  development: {
    port: 8000,
    connectionString: 'mongodb://localhost/cps-development'
  },
  test: {
    port: 8000,
    connectionString: 'mongodb://localhost/cps-test'
  }
}
