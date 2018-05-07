import DS from 'ember-data'
import { fragmentArray } from 'ember-data-model-fragments/attributes'
import { collectionAction } from 'ember-api-actions'
import pbxGroupValidations from '../validations/pbxGroup'

export default DS.Model.extend(pbxGroupValidations, {
  callTimeout: DS.attr(),
  cnamPrefix: DS.attr(),
  distinctiveRing: DS.attr(),
  extension: DS.attr(),
  mailbox: DS.attr(),
  name: DS.attr(),
  pbxAccountId: DS.attr(),
  sequential: DS.attr('boolean', {defaultValue: false}),
  pbxGroupUsers: DS.hasMany('pbxGroupUser'),
  getRings: collectionAction({path: 'ringtones', type: 'GET'}),
  getMailboxes: collectionAction({path: 'mailboxes', type: 'GET'}),
  getPbxUsers: collectionAction({path: 'pbx_users', type: 'GET'}),
})
