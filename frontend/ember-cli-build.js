/* eslint-env node */
'use strict'

const EmberApp = require('ember-cli/lib/broccoli/ember-app')

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },
    'ember-bootstrap': {
      'bootstrapVersion': 3,
      'importBootstrapFont': false,
      'importBootstrapCSS': false
    }
  });
  app.import(app.bowerDirectory + '/bootstrap-datepicker/less/datepicker.less')
  app.import(app.project.root + '/node_modules/jquery-match-height/jquery.matchHeight.js')
  app.import('node_modules/owasp-password-strength-test/owasp-password-strength-test.js',{using: [
      { transformation: 'amd', as: 'owasp-password-strength-test' }
    ]})
  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree()
}
