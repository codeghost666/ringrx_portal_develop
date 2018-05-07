import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  serializeIntoHash (data, type, snapshot, options) {
    var root = Ember.String.underscore(type.modelName)
    data[root] = this.serialize(snapshot, options)
  }
});
