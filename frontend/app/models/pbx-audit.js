import DS from 'ember-data';

export default DS.Model.extend({
  createdAt: DS.attr(),
  event: DS.attr(),
  ipaddress: DS.attr(),
  pbxAccountId: DS.attr(),
  role: DS.attr(),
  username: DS.attr()
});
