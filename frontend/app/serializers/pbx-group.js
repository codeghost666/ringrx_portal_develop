import ApplicationSerializer from './application';
import Ember from "ember"
import DS from 'ember-data'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    pbxGroupUsers: {embedded: 'always'}
  },
  serializeIntoHash (data, type, snapshot, options) {
    var root = Ember.String.underscore(type.modelName)
    data[root] = this.serialize(snapshot, options)
  }
});

