import {
  validatePresence,
  validateLength,
  validateFormat,
  validateNumber
} from 'ember-changeset-validations/validators'

export default {
  name: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-']+$/, allowBlank: false}),
  username: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/, allowBlank: false}),
  extension: validatePresence(true),
  pbxAccountId: [
    validatePresence(true),
    validateNumber({gte: 0})
  ],
  sipPassword: [
    validateFormat({
      regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d$@$!%*?&]{8,}$/,
      message: '{description} must have minimum eight characters,' +
      ' at least one uppercase letter, one lowercase letter and one number'
    })
  ],
  pin:
    [
      validatePresence(true),
      validateLength({min: 4, max: 9, message: '{description} must be between 4 and 9 digits'})
    ],
  maxBindings:
    [
      validatePresence(true),
      validateNumber({gte: 0, lte: 32})
    ],
  externalCalleridName:
    validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-']+$/, allowBlank: true}),
  externalCalleridNumber:
    validateFormat({type: 'phone', allowBlank: true}),
  email:
    validateFormat({type: 'email', allowBlank: false}),
  mobile:
    validateFormat({type: 'phone', allowBlank: true}),
  callTimeout:
    [
      validatePresence(true),
      validateNumber({gte: 0, lte: 100})
    ],
  forwardBehavior:
    validatePresence(true),
  pbxLocationId:
    validatePresence(true),
  vmEmailNotification:
    validateFormat({type: 'email', allowBlank: true}),
  vmEmailContent:
    validateFormat({type: 'email', allowBlank: true}),
  oncallRemindMinutes:
    [
      validatePresence(true),
      validateNumber({integer: true, gte: 1, lte: 240})
    ],
  role: validatePresence(true)
}

