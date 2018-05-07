import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  'passwordObj.currentPassword': validator('presence', true),
  'passwordObj.newPassword': {
    validators: [
      validator('presence', true),
      validator('password-strength-test')
    ]
  },
  'passwordObj.newPasswordConfirmation': validator('confirmation', {
    on: 'passwordObj.newPassword',
    message: 'Password Confirmation do not match new password',
  })
})
