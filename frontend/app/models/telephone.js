import { computed } from '@ember/object'
import attr from 'ember-data/attr'
import Fragment from 'ember-data-model-fragments/fragment'

export default Fragment.extend({

  type: attr(),
  number: attr({defaultValue: ''}),

  isValidTelephone: computed.match('number', /^\d{10}$/),
  isNotValidTelephone: computed.not('isValidTelephone'),

  isEmptyTelephone: computed.empty('number'),
  isNotEmptyTelephone: computed.not('isEmptyTelephone'),

  showTelephoneAlert: computed.and('isNotValidTelephone', 'isNotEmptyTelephone'),

})
