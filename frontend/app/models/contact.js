import DS from 'ember-data'
import { computed } from '@ember/object'
import { fragmentArray } from 'ember-data-model-fragments/attributes'

export default DS.Model.extend({

  domain: DS.attr(),
  user: DS.attr(),
  contactType: DS.attr({defaultValue: 'private'}),
  name: DS.attr({defaultValue: ';'}),
  org: DS.attr({defaultValue: ''}),
  title: DS.attr(),
  photo: DS.attr(),
  address: DS.attr(),
  email: DS.attr(),
  checked: DS.attr('boolean', {defaultValue: false}),
  telephone: fragmentArray('telephone'),

  namePrettyFormat: computed('name', function () {
    return this.get('name').split(';').join(' ')
  }),

  phone: computed('telephone', function () {
    return this.get('telephone').filterBy('type', 'phone').objectAt(0)
  }),

  fax: computed('telephone', function () {
    return this.get('telephone').filterBy('type', 'fax').objectAt(0)
  }),

  firstName: computed('name', {
    get (key) {
      return this.get('name').split(';')[0]
    },
    set (key, value) {
      let names = this.get('name').split(';')
      names[0] = value.trim()
      this.set('name', names.join(';'))
      return value
    }
  }),

  lastName: computed('name', {
    get (key) {
      return this.get('name').split(';')[1]
    },
    set (key, value) {

      let names = this.get('name').split(';')
      names[1] = value.trim()
      this.set('name', names.join(';'))
      return value
    }
  }),

  isValidFirstName: computed.match('firstName', /^[a-zA-Z][a-zA-Z\s-']+$/),
  isNotValidFirstName: computed.not('isValidFirstName'),
  isValidLastName: computed.match('lastName', /^[a-zA-Z][a-zA-Z\s-']+$/),
  isNotValidLastName: computed.not('isValidLastName'),
  isValidCompany: computed.match('org', /^.+$/),
  isNotValidCompany: computed.not('isValidCompany'),

  isEmptyFirstName: computed.empty('firstName'),
  isNotEmptyFirstName: computed.not('isEmptyFirstName'),
  isEmptyLastName: computed.empty('lastName'),
  isNotEmptyLastName: computed.not('isEmptyLastName'),
  isEmptyCompany: computed.empty('org'),
  isNotEmptyCompany: computed.not('isEmptyCompany'),

  showFirstNameAlert: computed.and('isNotValidFirstName', 'isNotEmptyFirstName'),
  showLastNameAlert: computed.and('isNotValidLastName', 'isNotEmptyLastName'),
  showCompanyAlert: computed.and('isNotValidCompany', 'isNotEmptyCompany'),

  isValid: computed('isValidFirstName', 'isValidLastName', 'phone.number', 'fax.number', function(){
  let phone = this.get('phone')
  let fax = this.get('fax')
  if (phone.get('showTelephoneAlert') || fax.get('showTelephoneAlert') || this.get('showFirstNameAlert') ||
  this.get('showLastNameAlert') || this.get('showCompanyAlert')){
    return false
  } else {
    return (this.get('isValidFirstName') || this.get('isValidLastName'))
  }
  }),
  isDisabled: computed.not('isValid')
})
