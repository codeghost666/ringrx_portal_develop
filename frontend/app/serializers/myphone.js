import ApplicationSerializer from './application'
import Ember from 'ember'
import DS from 'ember-data'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    pbxUserSchedules: {embedded: 'always'}
  },

  normalizeFindAllResponse (store, primaryModelClass, payload, id, requestType) {
    return this.normalizeSingleResponse(...arguments)
  },

  serializeIntoHash (data, type, snapshot, options) {
    let root = Ember.String.underscore('PbxMyPhone')
    data[root] = this.serialize(snapshot, options)
  },

  serializeId (snapshot, json, primaryKey) {
    json[`${primaryKey}`] = snapshot.id
  }
})
