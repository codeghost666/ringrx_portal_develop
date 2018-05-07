import DS from 'ember-data'
import pbxOncallShiftValidations from '../validations/pbxOncallShift'


export default DS.Model.extend(pbxOncallShiftValidations, {
  dayFri: DS.attr('boolean', {defaultValue: false}),
  dayMon: DS.attr('boolean', {defaultValue: false}),
  daySat: DS.attr('boolean', {defaultValue: false}),
  daySun: DS.attr('boolean', {defaultValue: false}),
  dayThu: DS.attr('boolean', {defaultValue: false}),
  dayTue: DS.attr('boolean', {defaultValue: false}),
  dayWed: DS.attr('boolean', {defaultValue: false}),
  metric: DS.attr(),
  name: DS.attr(),
  pbxOncallId: DS.attr(), //Display Only
  priority: DS.attr('number'),
  startTime: DS.attr(),
  endTime: DS.attr(),
  startAt: DS.attr(),
  endAt: DS.attr(),
  pbxOnCall: DS.belongsTo('pbxOnCall'),
  pbxOncallShiftUsers: DS.hasMany('pbxOncallShiftUser'),
})
