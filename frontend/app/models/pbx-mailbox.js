import DS from 'ember-data'
import { memberAction } from 'ember-api-actions'

export default DS.Model.extend({
  name: DS.attr(),
  pbxAccountId: DS.attr(),
  mailbox: DS.attr(),
  pin: DS.attr(),
  transcription: DS.attr('boolean', {defaultValue: false}),
  playEnvelope: DS.attr('boolean', {defaultValue: false}),
  emailContent: DS.attr(),
  emailNotification: DS.attr(),
  greeting: null,
  currentSound: null,
  download: memberAction({path: 'greeting', type: 'GET', ajaxOptions: {blob: true}}),
  getStatus: memberAction({path: 'status', type: 'GET'})
})

