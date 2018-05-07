import ApplicationSerializer from './application';
import Ember from 'ember'

export default ApplicationSerializer.extend({
  normalizeFindAllResponse(store, primaryModelClass, payload, id, requestType) {
    return this.normalizeSingleResponse(...arguments);
  },
  serializeIntoHash (data, type, snapshot, options) {
    let root = Ember.String.decamelize(type.modelName)
    data[root] = this.serialize(snapshot, options)
  },
  serializeId (snapshot, json, primaryKey) {
    json[`_${primaryKey}`] = snapshot.id
  }
});
