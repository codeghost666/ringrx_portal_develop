import {
  validatePresence,
  validateFormat,
  validateInclusion
} from 'ember-changeset-validations/validators'
import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'

export default {
  pbxAccountId: validatePresence(true),
  name: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/, allowBlank: false}),
  extension: validatePresence(true),
  defaultCallerid: validatePresence(true),
  defaultFormat: validatePresence(true),
  destinationType: validatePresence(true),
  destinationEmail: validateFormat({type: 'email', allowBlank: true}),
  destinationMailbox: validatePresence(true),
  notificationEmail: validateFormat({type: 'email', allowBlank: true}),
}
