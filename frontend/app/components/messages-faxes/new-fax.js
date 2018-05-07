import Component from '@ember/component'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'

export default Component.extend({
  notifications: service('notification-messages'),
  isShowingModal: false,
  contacts: [],
  subject: '',
  comment: '',
  isSaveContact: false,
  isIncludeCoverPage: false,
  isShowValidations: false,
  faxFile: null,

  initNewContact: on('init', function () {
    this.set('newContact', {
      fax: '',
      firstName: '',
      lastName: '',
      company: ''
    })
  }),

  isReadyToCreate: computed('validOrInput', 'someChecked', function () {
    let validOrInput = this.get('validOrInput')

    let isContactChecked = this.get('someChecked')

    return !validOrInput ? false : (validOrInput || isContactChecked) && this.get('faxFile')
  }),

  validOrInput: computed('isSaveContact', 'newContact.firstName', 'newContact.lastName', 'isFaxValid',
    'newContact.company', function () {
      let validOrInput = !this.get('isShowFaxError')
      if (this.get('isSaveContact')) {
        validOrInput = !!(validOrInput && (this.get('newContact').firstName ||
          this.get('newContact').lastName))
      }
      return validOrInput
    }),

  someChecked: computed('contacts.@each.checked', function () {
    return this.get('contacts').any((contact) => contact.get('checked'))
  }),

  recipients: computed('contacts.@each.checked', function () {
    return this.get('contacts').filterBy('checked').map((contact) => {
      let first = contact.get('firstName') || ''
      let last = contact.get('lastName') || ''
      let number = this.numberPrettyFormat(contact.get('fax.number'))
      return `${first} ${last} (${number})`
    }).join('; ')
  }),

  numberPrettyFormat (number) {
    if (number && number.match(/\+?\d{10}/)) {
      if (number.startsWith('+')) {
        number = number.substring(1)
      }
      if (number.startsWith('1')) {
        number = number.substring(1)
      }
      return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`
    }
    return number
  },

  isShowContactsError: computed('isShowValidations', 'validOrInput', 'someChecked', function () {
    if (this.get('isShowValidations')) {
      return !!this.get('validOrInput') || this.get('someChecked')
    } else {
      false
    }
  }),

  isFaxValid: computed.match('newContact.fax', /^\d{10}$/),

  isShowFaxError: computed('isShowValidations', 'isSaveContact', 'isFaxValid', 'newContact.fax', 'someChecked', function () {
    if (this.get('isShowValidations')) {
      if (this.get('newContact').fax.length > 0) {
        return !this.get('isFaxValid')
      } else if (this.get('isSaveContact')) {
        return true
      }
      else {
        return !this.get('someChecked')
      }
    } else {
      false
    }
  }),

  isShowNameError: computed('isShowValidations', 'isSaveContact', 'newContact.firstName', 'newContact.lastName', function () {
    if (this.get('isSaveContact') && this.get('isShowValidations')) {
      return !(this.get('newContact').firstName.length > 0 || this.get('newContact').lastName.length > 0)
    } else {
      return false
    }
  }),

  sendFax: task(function * () {
    this.set('isShowValidations', true)
    if (this.get('isReadyToCreate')) {
      if (this.get('isSaveContact')) {
        yield this.get('sendNewFaxes')(this.get('newContact'), this.get('faxFile'), this.get('subject'),
          this.get('comment'), this.get('isIncludeCoverPage'))
      } else {
        yield this.get('sendNewFaxes')(this.get('newContact').fax, this.get('faxFile'), this.get('subject'),
          this.get('comment'), this.get('isIncludeCoverPage'))
      }
    } else {
      this.get('notifications').error('Select file and contact from list or input correct fax number.', {
        autoClear: true,
        clearDuration: 6200
      })
    }

  }).drop(),

  showContacts: task(function * () {
    let contacts = []
    yield contacts = this.get('getContacts')()
    this.set('contacts', contacts.filter((contact) => {
      return !Ember.isBlank(contact.get('fax.number'))
    }))
    this.toggleProperty('isShowingModal')
  }).drop(),

  isNoContacts: computed.empty('contacts'),

  actions: {
    closeModal () {
      this.set('isShowingModal', false)
    },

    cancelModal () {
      this.get('rollBackContacts')()
      this.set('isShowingModal', false)
    },

    setFaxFile: function () {
      var file = document.getElementById('file-field').files[0]
      if (file) {
        if (file.size > 1024000) {
          this.get('notifications').warning('Select file les then 1 MB.', {
            autoClear: true,
            clearDuration: 6200
          })
        } else if (['image/tiff', 'application/pdf'].includes(file.type)) {
          this.set('faxFile', file)
        } else {
          this.get('notifications').warning('Allows only PDF or TIFF formats', {
            autoClear: true,
            clearDuration: 6200
          })
        }
      }
    },
  }

})
