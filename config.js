/*
 * Create & export configuration variables
 *
 */

//container for all the environments
var environments = {};

//staging environment (default)
environments.staging = {
  'port' : 3000,
  'envName' : 'staging'
};

//production environment
environments.production = {
  'port' : 5000,
  'envName' : 'production'
};

//determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check if the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
