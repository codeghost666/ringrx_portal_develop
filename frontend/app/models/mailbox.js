import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'

export default DS.Model.extend({
  mailbox: DS.attr(), //display only
  pin: DS.attr(),
  transcription: DS.attr('boolean'), //display only
  playEnvelope: DS.attr('boolean'),
  quota: DS.attr('number'), //display only
  quotaUse: DS.attr('number'), //display only
  emailContent: DS.attr(),
  emailNotification: DS.attr(),
  greeting: DS.attr(),
  greetingFile: null,
  download: collectionAction({ path: 'greeting', type: 'GET', ajaxOptions: { arraybuffer: true } })

})
