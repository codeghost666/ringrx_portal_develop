import DS from 'ember-data'
import { fragmentArray } from 'ember-data-model-fragments/attributes'
import { memberAction } from 'ember-api-actions'

export default DS.Model.extend({
  mailbox: DS.attr(),
  caller: DS.attr(),
  createdAt: DS.attr(),
  status: DS.attr(),
  messageType: DS.attr(),
  messageFolder: DS.attr(),
  notes: DS.attr(),
  voicemail: DS.attr({defaultValue: ''}),
  fax: DS.attr({defaultValue: ''}),
  transcription: DS.attr(),
  history: fragmentArray('voicemailMessageHistory'),
  voicePayloadFile: null,
  voicePayload: memberAction({path: 'voice_payload', type: 'GET', ajaxOptions: {blob: true}}),
  faxPayload: memberAction({path: 'fax_payload', type: 'GET', ajaxOptions: {blob: true}})
})

