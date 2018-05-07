import Component from '@ember/component'
import passwordObjValidations from 'frontend/validations/mySettingsPassword'
import { task } from 'ember-concurrency'
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'

export default Component.extend(passwordObjValidations, {
  notifications: service('notification-messages'),
  passwordObj: {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirmation: ''
  },
  showValidations: false,
  showCurrentPasswordValidation: false,
  showNewPasswordValidation: false,
  showConfirmationValidation: false,

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('validations.attrs.passwordObj'))
  }),

  resetPasswordObject(){
    Object.keys(this.get('passwordObj')).forEach((key)=>{
      this.get('passwordObj')[key]=''
    })
  },

  ShowCurrentPasswordError: computed('showValidations', 'validation.currentPassword.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.currentPassword.isInvalid')
      } else {
        return false
      }
    }),

  ShowNewPasswordError: computed('showValidations', 'validation.newPassword.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.newPassword.isInvalid')
      } else {
        return false
      }
    }),
  ShowConfirmationError: computed('showValidations', 'validation.newPasswordConfirmation.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.newPasswordConfirmation.isInvalid')
      } else {
        return false
      }
    }),

  saveButtonClick: task(function * () {
    this.set('showValidations', true)
    if (this.get('validations.isValid')) {
      yield this.get('updatePassword')(this.get('passwordObj')).then(()=>{
        this.resetPasswordObject()
      },()=>{})
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions: {
    rollback () {
      this.toggleProperty('isShowingModal')
    }
  }
})
