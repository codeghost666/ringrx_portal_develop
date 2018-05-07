import DS from 'ember-data'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  startTime: DS.attr(),
  hangupCause: DS.attr(),
  callingParty: DS.attr(),
  calledParty: DS.attr(),
  callerIdNumber: DS.attr(),
  callerIdName: DS.attr(),
  billDuration: DS.attr()
})
