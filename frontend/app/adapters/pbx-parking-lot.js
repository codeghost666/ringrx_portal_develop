import ApplicationAdapter from './application';
import Ember from "ember"
import Inflector from 'ember-inflector'

export default ApplicationAdapter.extend({
  pathForType (modelName) {
    let camelize = Ember.String.camelize(modelName)
    return Inflector.inflector.pluralize(camelize.toLowerCase())
  },

  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  }
});
