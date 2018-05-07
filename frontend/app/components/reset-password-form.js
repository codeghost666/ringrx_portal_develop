import Component from '@ember/component'
import passwordObjValidations from 'frontend/validations/resetPassword'
import { task } from 'ember-concurrency'
import { computed } from '@ember/object'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'

export default Component.extend(passwordObjValidations, {
  notifications: service('notification-messages'),
  passwordObj: {
    password: '',
    passwordConfirmation: ''
  },
  showValidations: false,

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('validations.attrs.passwordObj'))
  }),

  ShowPasswordError: computed('showValidations', 'validation.password.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.password.isInvalid')
      } else {
        return false
      }
    }),
  ShowConfirmationError: computed('showValidations', 'validation.passwordConfirmation.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.passwordConfirmation.isInvalid')
      } else {
        return false
      }
    }),

  changePassword: task(function * () {
    this.set('showValidations', true)
    if (this.get('validations.isValid')) {
      yield this.get('resetPassword')(this.get('passwordObj'))
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),
})
