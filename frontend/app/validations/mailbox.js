import {
  validatePresence,
  validateLength,
  validateFormat
} from 'ember-changeset-validations/validators';


export default {
  pin: [
    validatePresence(true),
    validateLength({ min: 4, max: 9})
  ],
  emailContent: validateFormat({ type: 'email', allowBlank: true }),
  emailNotification: validateFormat({ type: 'email', allowBlank: true })
};
