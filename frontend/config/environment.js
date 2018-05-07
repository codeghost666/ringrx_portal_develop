/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend',
    environment,
    rootURL: '/',
    locationType: 'auto',
    changeTracker: { trackHasMany: true, auto: true, enableIsDirty: true },
    paginationProperty: {
      10: 10,
      25: 25,
      50: 50,
      100: 100
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
        'ds-serialize-id': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created

}
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
     ENV.APP.LOG_ACTIVE_GENERATION = true;
     ENV.APP.LOG_TRANSITIONS = true;
     ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
     ENV.APP.LOG_VIEW_LOOKUPS = true;
      ENV['ember-cli-mirage'] = {
        enabled: false
      };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.isProduction = true;
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;
    ENV.APP.LOG_BINDINGS = false
  }
  ENV['ember-simple-auth'] = {
    authorizer: 'authorizer:token',
    routeAfterAuthentication: 'dashboard'
  };

  ENV['ember-simple-auth-token'] = {
    authenticationRoute: 'login',
    serverTokenEndpoint: 'auth/token',
    identificationField: 'username',
    passwordField: 'password',
    tokenPropertyName: 'access_token',
    refreshAccessTokens: true,
    //refreshLeeway: 300, // Refresh the token 5 minutes (300s) before it expires.
    refreshLeeway: 5, // Refresh the token 5s before it expires.
    serverTokenRefreshEndpoint: '/auth/refresh',
    refreshTokenPropertyName: 'refresh_token',
  };

  return ENV;
};
