import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  name: [
    validator('presence', true),
    validator('format', {
      regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
      message: 'Group Name must have minimum two characters'
    })
  ],
  cnamPrefix: {
    validators: [
      validator('length', {
        max: 255
      })
    ]
  },
  distinctiveRing: validator('presence', true),
  extension: validator('presence', true),
  callTimeout: {
    validators: [
      validator('presence', true),
      validator('number', {
        allowString: true,
        integer: true,
        gte: 0,
        lte: 100
      })
    ]
  },
  pbxGroupUsers: validator('has-many')
})
