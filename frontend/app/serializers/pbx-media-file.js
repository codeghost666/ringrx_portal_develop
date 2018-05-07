import ApplicationSerializer from './application';
import Ember from 'ember'

export default ApplicationSerializer.extend({
  serializeIntoHash (data, type, snapshot, options) {
    var root = Ember.String.underscore(type.modelName)
    data[root] = this.serialize(snapshot, options)
  }
});
