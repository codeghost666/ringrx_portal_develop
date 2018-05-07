import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'
import pbxOnCallValidations from '../validations/pbxOnCall'

export default DS.Model.extend(pbxOnCallValidations, {

  callerid: DS.attr(),
  extension: DS.attr(),
  greeting: DS.attr(),
  mailbox: DS.attr(),
  minutes: DS.attr('number'),
  moh: DS.attr(),
  name: DS.attr(),
  pbxAccountId: DS.attr(),
  recordCalls: DS.attr(),
  retries: DS.attr('number'),
  shiftAlarm: DS.attr(),
  shiftAlarmMinutes: DS.attr('number'),
  shiftAlarmSuppress: DS.attr(),
  pbxOncallShifts: DS.hasMany('pbxOncallShift'),
  getMohs: collectionAction({path: 'moh', type: 'GET'}),
  getMediafiles: collectionAction({path: 'mediafiles', type: 'GET'}),
  getMailboxes: collectionAction({path: 'mailboxes', type: 'GET'}),
  getPhonenumbers: collectionAction({path: 'phonenumbers', type: 'GET'}),
  getPbxUsers: collectionAction({path: 'pbx_users', type: 'GET'}),
})
