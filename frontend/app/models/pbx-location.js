import DS from 'ember-data'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  name: DS.attr(),
  address: DS.attr(),
  city: DS.attr(),
  state: DS.attr(),
  zip: DS.attr()

})
