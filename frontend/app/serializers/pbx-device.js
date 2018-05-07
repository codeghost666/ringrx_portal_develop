import ApplicationSerializer from './application';
import Ember from "ember"
import DS from 'ember-data'

export default ApplicationSerializer.extend(DS.EmbeddedRecordsMixin, {
  attrs: {
    pbxDeviceBindings: {embedded: 'always'}
  },
  serializeIntoHash (data, type, snapshot, options) {
    let root = Ember.String.underscore(type.modelName);
    data[root] = this.serialize(snapshot, options)
  }
});

