import ApplicationAdapter from './application';
import Ember from "ember"
import Inflector from 'ember-inflector'

export default ApplicationAdapter.extend({

  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  }
});
