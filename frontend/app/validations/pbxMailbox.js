import {
  validatePresence,
  validateLength,
  validateFormat
} from 'ember-changeset-validations/validators'

export default {
  name: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/, allowBlank: false}),
  mailbox: validateFormat({type: 'email', allowBlank: false}),
  pin: [
    validatePresence(true),
    validateLength({min: 4, max: 9})
  ],
  emailContent: validateFormat({type: 'email', allowBlank: true}),
  emailNotification: validateFormat({type: 'email', allowBlank: true})
}
