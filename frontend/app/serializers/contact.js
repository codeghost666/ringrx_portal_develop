import ApplicationSerializer from './application'
import DS from 'ember-data'
import Ember from 'ember'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {

  attrs: {
    telephone: {embedded: 'always'}
  },
  serializeIntoHash (data, type, snapshot, options) {
    var root = Ember.String.underscore(type.modelName)
    data[root] = this.serialize(snapshot, options)
  },

  serializeId (snapshot, json, primaryKey) {
    json[`_${primaryKey}`] = snapshot.id
  }

})
