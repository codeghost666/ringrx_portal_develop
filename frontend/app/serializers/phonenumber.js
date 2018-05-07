import ApplicationSerializer from './application'
import Ember from 'ember'

export default ApplicationSerializer.extend({
  serializeIntoHash (data, type, snapshot, options) {
    let root = Ember.String.underscore('pbxPhoneNumber')
    data[root] = this.serialize(snapshot, options)
  }
})
