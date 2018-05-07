import DS from 'ember-data';
import pbxUserSchedule from '../validations/pbxUserSchedule'

export default DS.Model.extend(pbxUserSchedule, {
  dayFri: DS.attr('boolean', {defaultValue: false}),
  dayMon: DS.attr('boolean', {defaultValue: false}),
  daySat: DS.attr('boolean', {defaultValue: false}),
  daySun: DS.attr('boolean', {defaultValue: false}),
  dayThu: DS.attr('boolean', {defaultValue: false}),
  dayTue: DS.attr('boolean', {defaultValue: false}),
  dayWed: DS.attr('boolean', {defaultValue: false}),
  metric: DS.attr(),
  name: DS.attr(),
  pbxUserId: DS.attr(), //Display Only
  pbxMyPhoneId: DS.attr(),
  priority: DS.attr('number'),
  startTime: DS.attr(),
  endTime: DS.attr(),
  startAt: DS.attr(),
  endAt: DS.attr(),
  oncallBehavior: DS.attr(),
  forwardBehavior: DS.attr(),
  pbxMyPhone: DS.belongsTo('myphone'),
});
