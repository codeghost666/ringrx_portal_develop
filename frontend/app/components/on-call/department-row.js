import Component from '@ember/component'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'
import Ember from 'ember'
import { inject as service } from '@ember/service'
import { on } from '@ember/object/evented'

export default Component.extend({
  notifications: service('notification-messages'),
  tagName: 'tr',
  classNameBindings: ['editShift'],
  editShift: false,
  showValidations: false,
  ShowNameValidation: false,
  ShowRetriesValidation: false,
  ShowMinutesValidation: false,
  ShowCalleridValidation: false,
  ShowShiftAlarmMinutesValidation: false,

  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},

  initValidation: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('department.validations.attrs'))
  }),

  showNameError: computed('showValidations', 'ShowNameValidation', 'validation.name.isInvalid',
    function () {
      if (this.get('ShowNameValidation') || this.get('showValidations')) {
        return this.get('validation.name.isInvalid')
      } else {
        return false
      }
    }),

  showMohError: computed('showValidations', 'validation.moh.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.moh.isInvalid')
      } else {
        return false
      }
    }),

  ShowMailboxError: computed('showValidations', 'validation.mailbox.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.mailbox.isInvalid')
      } else {
        return false
      }
    }),

  ShowRetriesError: computed('showValidations', 'ShowRetriesValidation', 'validation.retries.isInvalid',
    function () {
      if (this.get('ShowRetriesValidation') || this.get('showValidations')) {
        return this.get('validation.retries.isInvalid')
      } else {
        return false
      }
    }),

  ShowMinutesError: computed('showValidations', 'ShowMinutesValidation', 'validation.minutes.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.minutes.isInvalid')
      } else {
        return false
      }
    }),
  ShowCalleridError: computed('showValidations', 'ShowCalleridValidation', 'validation.callerid.isInvalid',
    function () {
      if (this.get('ShowCalleridValidation') || this.get('showValidations')) {
        return this.get('validation.callerid.isInvalid')
      } else {
        return false
      }
    }),
  ShowshiftAlarmMinutesError: computed('showValidations', 'ShowShiftAlarmMinutesValidation', 'validation.shiftAlarmMinutes.isInvalid',
    function () {
      if (this.get('ShowshiftAlarmMinutesValidation') || this.get('showValidations')) {
        return this.get('validation.shiftAlarmMinutes.isInvalid')
      } else {
        return false
      }
    }),

  deleteRecord: task(function * () {
    yield this.get('deleteOncall')(this.get('department'))
  }).drop(),

  saveRecord: task(function * () {
    this.set('showValidations', true)
    if (this.get('department.validations.isValid')) {
      yield this.get('saveOncall')(this.get('department')).then(()=>{
        this.set('editShift', false)
      }, ()=>{

      })
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions: {
    editDepartment () {
      if (this.get('deleteRecord').isIdle) {
        this.toggleProperty('editShift')
      }
    },

    setProperty(property, value){
      this.get('department').set(property, value)
    },

    rollback(){
      this.get('department').rollbackAttributes()
      this.toggleProperty('editShift')
    }
  }
})
