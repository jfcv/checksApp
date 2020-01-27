/*
 * Create & export configuration variables
 *
 */

//container for all the environments
var environments = {};

//staging environment (default)
environments.staging = {
  'httpPort' : 3000,
  'httpsPort' : 3001,
  'envName' : 'staging',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC23a2a4a1091c095306a9bb008b73ea06',
    'authToken' : 'ff76ddac3bbe780051b024b5d3a8ef56',
    'fromPhone' : '+13212505128'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'notARealCompany, Inc',
    'yearCreated' : '2020',
    'baseUrl' : 'http://localhost:3000/'
  }
};

//testing environment
environments.testing = {
  'httpPort' : 4000,
  'httpsPort' : 4001,
  'envName' : 'testing',
  'hashingSecret' : 'thisIsASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC23a2a4a1091c095306a9bb008b73ea06',
    'authToken' : 'ff76ddac3bbe780051b024b5d3a8ef56',
    'fromPhone' : '+13212505128'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'notARealCompany, Inc',
    'yearCreated' : '2020',
    'baseUrl' : 'http://localhost:3000/'
  }
};

//production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort' : 5001,
  'envName' : 'production',
  'hashingSecret' : 'thisIsAlsoASecret',
  'maxChecks' : 5,
  'twilio' : {
    'accountSid' : 'AC23a2a4a1091c095306a9bb008b73ea06',
    'authToken' : 'ff76ddac3bbe780051b024b5d3a8ef56',
    'fromPhone' : '+13212505128'
  },
  'templateGlobals' : {
    'appName' : 'UptimeChecker',
    'companyName' : 'notARealCompany, Inc',
    'yearCreated' : '2020',
    'baseUrl' : 'http://localhost:5000/'
  }
};

//determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check if the current environment is one of the environments above, if not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = environmentToExport;
