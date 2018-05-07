import Component from '@ember/component'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'
import DS from 'ember-data'

export default Component.extend({
  classNames: ['row', 'form-row'],
  pbxUserProperties: {},
  pbxUserOptions: [],
  showValidations: false,
  validation: null,
  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('user.validations.attrs'))
  }),
  ShowPbxUserIdError: computed('showValidations', 'validation.pbxUserId.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.pbxUserId.isInvalid')
      } else {
        return false
      }
    }),
  ShowPriorityError: computed('showValidations', 'validation.priority.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.priority.isInvalid')
      } else {
        return false
      }
    }),
  deleteUser: task(function * () {
      yield this.get('deleteRecord')(this.get('user'))
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
        this.get('user').set(propertie, value)
        return value
      }
    },

})
