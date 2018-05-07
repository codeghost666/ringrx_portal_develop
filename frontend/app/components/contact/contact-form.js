import Component from '@ember/component'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'

export default Component.extend({
  notifications: service('notification-messages'),
  formTitle: 'Contact',
  item: null,
  phone: computed('item.phone.number', {
    get(key){
      return this.get('item').get('phone').get('number')
    },
    set(key, value){
      let phone = this.get('item').get('phone')
      if (value === '(___)-___-____'){
        phone.set('number', '')
        return ''
      } else{
        phone.set('number', value)
        return value
      }
    }
  }),

  fax: computed('item.fax.number', {
    get(key){
      return this.get('item').get('fax').get('number')
    },
    set(key, value){
      let fax = this.get('item').get('fax')
      if (value === '(___)-___-____'){
        fax.set('number', '')
        return ''
      } else{
        fax.set('number', value)
        return value
      }
    }
  }),

  saveButtonClick: task(function * () {
    let contact = this.get('item')
    if (contact.get('isValid')) {
      yield this.get('save')(contact)
    } else {
      let textDefault = 'Change a few things up and try submitting again.';
      let notification;
      if (!(contact.get('isValidFirstName') || contact.get('isValidLastName'))){
        notification = 'Contact should have valid first or last name.'
      }
      this.get('notifications').error(notification || 'Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions:
    {
      setSelection (value) {
        this.set('item.contactType', value)
      },

      rollback () {
        this.attrs.rollback(this.get('item'))
      }
    }

})

