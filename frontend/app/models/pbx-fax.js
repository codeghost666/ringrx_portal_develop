import DS from 'ember-data';
import { collectionAction } from 'ember-api-actions'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  name: DS.attr(),
  extension: DS.attr(),
  defaultCallerid: DS.attr(),
  defaultFormat: DS.attr(),
  destinationType: DS.attr(),
  destinationEmail: DS.attr(),
  destinationMailbox: DS.attr(),
  notificationEmail: DS.attr(),
  notifyFailure: DS.attr('boolean', {defaultValue: false}),
  getPhonenumbers: collectionAction({path: 'phonenumbers', type: 'GET'}),
  getFormats: collectionAction({path: 'formats', type: 'GET'}),
  getDestinationTypes: collectionAction({path: 'destination_types', type: 'GET'}),
  getMailboxes: collectionAction({path: 'mailboxes', type: 'GET'}),

});
