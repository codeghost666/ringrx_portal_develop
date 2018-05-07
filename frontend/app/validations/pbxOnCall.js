import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  name: [
    validator('presence', true),
    validator('format', {
      regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
      message: 'Department name must have minimum two characters'
    })
  ],
  moh: validator('presence', true),
  retries: {
    validators: [
      validator('number', {
        allowString: true,
        integer: true,
        gte: 1,
        lte: 100
      })
    ]
  },
  minutes: {
    validators: [
      validator('number', {
        allowString: true,
        integer: true,
        gte: 3,
        lte: 600
      })
    ]
  },
  callerid: validator('presence', true),
  pbxAccountId: validator('presence', true),
  shiftAlarmMinutes: {
    validators: [
      validator('number', {
        allowString: true,
        integer: true,
        gte: 15,
        lte: 600
      })
    ]
  },

  pbxOncallShifts: validator('has-many')
})

