import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { trySet, computed } from '@ember/object'

export default Component.extend({
  notifications: service('notification-messages'),
  ringProperties: {},
  mailboxProperties: {},
  pbxUserProperties: {},
  pbxPriorityProperties: {1: 1, 2: 2, 3: 3},
  validation: null,
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},
  showValidations: false,
  ShowNameValidation: false,
  ShowExtensionValidation: false,
  ShowCallTimeoutValidation: false,
  ShowCnamPrefixValidation: false,

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('model.validations.attrs'))
    this.model.getRings().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'ringProperties', response)
      }
    })
    this.model.getMailboxes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'mailboxProperties', response)
      }
    })
    this.model.getPbxUsers().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'pbxUserProperties', response)
      }
    })
  }),
  pbxUsers: computed('pbxUserProperties', function () {
    let pbxUsers = Object.keys(this.pbxUserProperties).map((property) => {
      return {key: property, value: this.pbxUserProperties[property]}
    })
    return Ember.A(pbxUsers)
  }),
  usedUsers: computed('model.pbxGroupUsers.@each.pbxUserId', function () {
    let usedUsers = Ember.A()
    this.get('model').get('pbxGroupUsers').map((user) => {
      if (user.get('pbxUserId')) {usedUsers.push(String(user.get('pbxUserId')))}
    })
    return usedUsers
  }),
  pbxUserOptions: computed('pbxUsers', 'usedUsers.length', function () {
    return this.get('pbxUsers').filter((user) => {
      return !this.get('usedUsers').includes(user.key)
    })
  }),

  showNameError: computed('showValidations', 'ShowNameValidation', 'validation.name.isInvalid',
    function () {
      if (this.get('ShowNameValidation') || this.get('showValidations')) {
        return this.get('validation.name.isInvalid')
      } else {
        return false
      }
    }),

  ShowExtensionError: computed('showValidations', 'ShowExtensionValidation', 'validation.extension.isInvalid',
    function () {
      if (this.get('ShowExtensionValidation') || this.get('showValidations')) {
        return this.get('validation.extension.isInvalid')
      } else {
        return false
      }
    }),

  ShowDistinctiveRingError: computed('showValidations', 'validation.distinctiveRing.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.distinctiveRing.isInvalid')
      } else {
        return false
      }
    }),
  ShowCallTimeoutError: computed('showValidations', 'ShowCallTimeoutValidation', 'validation.callTimeout.isInvalid',
    function () {
      if (this.get('ShowCallTimeoutValidation') || this.get('showValidations')) {
        return this.get('validation.callTimeout.isInvalid')
      } else {
        return false
      }
    }),
  ShowCnamPrefixError: computed('showValidations', 'ShowCnamPrefixValidation', 'validation.cnamPrefix.isInvalid',
    function () {
      if (this.get('ShowCnamPrefixValidation') || this.get('showValidations')) {
        return this.get('validation.cnamPrefix.isInvalid')
      } else {
        return false
      }
    }),

  saveButtonClick: task(function * () {
    this.set('showValidations', true)
    let model = this.get('model')
    if (model.get('validations.isValid')) {
      yield this.get('save')(model)
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  AddGroupUser: task(function * () {
      yield this.get('addNewGroupUser')(this.get('model'))
    }
  ).drop(),

  didInsertElement () {
    $.fn.matchHeight._maintainScroll = true;
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },
  didDestroyElement () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  actions:
    {
      setPropertie (propertie, value) {
        this.get('model').set(propertie, value)
        return value
      },

      rollback () {
        this.attrs.rollback(this.get('model'))
      }
    }
})
