import {
  validatePresence,
  validateLength,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators'

export default {
  pin: [
    validatePresence(true),
    validateLength({min: 4, max: 9, message: '{description} must be between 4 and 9 digits'})
  ],
  email: validateFormat({type: 'email'}),
  mobile: validateFormat({type: 'phone', allowBlank: true}),
  callTimeout: [
    validatePresence(true),
    validateNumber({integer: true, gte: 1, lte: 100})
  ],
  vmEmailNotification: validateFormat({type: 'email', allowBlank: true}),
  vmEmailContent: validateFormat({type: 'email', allowBlank: true}),
  oncallRemindMinutes: [
    validatePresence(true),
    validateNumber({integer: true, gte: 1, lte: 240})
  ]
}
