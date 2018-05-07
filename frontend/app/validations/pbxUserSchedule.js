import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  startTime: validator('user-schedule-time', {dependentKeys: ['model.endTime']}),
  dayMon: validator('day-mark', {
    dependentKeys: ['model.dayMon',
      'model.daySat',
      'model.daySun',
      'model.dayFri',
      'model.dayThu',
      'model.dayTue',
      'model.dayWed']
  }),
  oncallBehavior: validator('presence', true),
  forwardBehavior: validator('presence', true),
  name: validator('format', {
    regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
    message: 'Allows only letters, digits, space, "-" and "_"'
  }),
})
