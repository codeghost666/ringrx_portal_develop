import attr from 'ember-data/attr';
import Fragment from 'ember-data-model-fragments/fragment';

export default Fragment.extend({
  pbxPhoneNumberId: attr('string'),
  prefix: attr('string'),
  action: attr('string'),
  cnamPrefix: attr('string'),
  extension: attr('string'),
  weight: attr('string')
});

