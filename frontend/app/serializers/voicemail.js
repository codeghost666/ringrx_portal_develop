import ApplicationSerializer from './application'
import DS from 'ember-data'
import Ember from 'ember'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    history: {embedded: 'always'}
  },
  serializeIntoHash (data, type, snapshot, options) {
    let root = Ember.String.decamelize(type.modelName)
    data[root] = this.serialize(snapshot, options)
  },
  serializeId (snapshot, json, primaryKey) {
    json[`_${primaryKey}`] = snapshot.id
  }

})
