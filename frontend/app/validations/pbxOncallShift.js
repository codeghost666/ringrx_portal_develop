import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  startAt: {
    validators: [
      validator('single-shift', {dependentKeys: ['model.endAt']}),
    ]
  },
  startTime: validator('repeated-shift', {dependentKeys: ['model.endTime']}),

  dayMon: validator('day-mark', {
    dependentKeys: ['model.dayMon',
      'model.daySat',
      'model.daySun',
      'model.dayFri',
      'model.dayThu',
      'model.dayTue',
      'model.dayWed']
  }),

  pbxOncallShiftUsers: validator('has-many')
})
