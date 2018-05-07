import DS from 'ember-data'
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin'
import Ember from 'ember'
import Inflector from 'ember-inflector'
import AdapterArrayBufferMixin from 'ember-cli-file-saver/mixins/adapter-arraybuffer-mixin'

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, AdapterArrayBufferMixin, {
  authorizer: 'authorizer:token',
  pathForType (modelName) {
    let camelize = Ember.String.camelize(modelName)
    return Inflector.inflector.pluralize(camelize.toLowerCase())
  }
})
