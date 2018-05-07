import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  extension: DS.attr(),
  moh: DS.attr(),
  timeout: DS.attr(),
  timeoutExtension: DS.attr(),
  getMohs: collectionAction({path: 'moh', type: 'GET'}),
  getTimeoutExtensions: collectionAction({path: 'extensions', type: 'GET'})
})


