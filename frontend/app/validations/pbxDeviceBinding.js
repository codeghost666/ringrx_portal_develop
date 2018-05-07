import { validator, buildValidations } from 'ember-cp-validations'
import DS from 'ember-data'

export default buildValidations({
  bindingBehavior: validator('presence', true),
  pbxUserId: {
    validators: [
      validator('dependent', {
        on: ['bindingBehavior']
      }),
      validator('device-binding-user')
    ]
  },
  bindingArgument: [
    validator('format', {
      regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
      allowBlank: true,
      message: 'Binding Argument should have minimum two characters'
    })
  ],
  bindingDisplay: [
    validator('format', {
      regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
      allowBlank: true,
      message: 'Binding Argument should have minimum two characters'
    })
  ],
  pbxDevice: validator('belongs-to')
})
