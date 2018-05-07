import DS from 'ember-data';

export default DS.Model.extend({
  faxfile: DS.attr('file'),
  calledNumber: DS.attr(),
  subject: DS.attr(),
  comment: DS.attr(),
  cover: DS.attr('boolean')
});
