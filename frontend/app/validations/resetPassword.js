import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  'passwordObj.password': {
    validators: [
      validator('presence', true),
      validator('password-strength-test')
    ]
  },
  'passwordObj.passwordConfirmation': validator('confirmation', {
    on: 'passwordObj.password',
    message: 'Password Confirmation do not match new password',
  })
})
