import ApplicationAdapter from './application'
import DS from 'ember-data'

export default ApplicationAdapter.extend(DS.EmbeddedRecordsMixin, {
  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  },

  attrs: {
    pbxPhoneNumberRule: {embedded: 'always'}
  }
})
