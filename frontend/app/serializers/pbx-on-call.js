import ApplicationSerializer from './application'
import DS from 'ember-data'
import Ember from 'ember'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {

  attrs: {
    pbxOncallShifts: {embedded: 'always'}
  },
  serializeIntoHash (data, type, snapshot, options) {
    var root = Ember.String.underscore(type.modelName)
    data[root] = this.serialize(snapshot, options)
  }

})
