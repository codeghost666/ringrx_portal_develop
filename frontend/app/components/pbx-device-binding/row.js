import Component from '@ember/component'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'

export default Component.extend({
  bindingTypeProperties: {},
  bindingBehaviorProperties: {},
  usersProperties: {},
  parkingLotProperties: {},
  showValidations: false,
  ShowIndexValidation: false,
  ShowDisplayValidation: false,
  ShowArgumentValidation: false,
  validation: null,
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},
  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('item.validations.attrs'))
  }),
  ShowBindingTypeError: computed('showValidations', 'validation.bindingType.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.bindingType.isInvalid')
      } else {
        return false
      }
    }),
  ShowBindingBehaviorError: computed('showValidations', 'validation.bindingBehavior.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.bindingBehavior.isInvalid')
      } else {
        return false
      }
    }),

  showIndexError: computed('showValidations', 'ShowIndexValidation', 'validation.bindingIndex.isInvalid',
    function () {
      if (this.get('ShowIndexValidation') || this.get('showValidations')) {
        return this.get('validation.bindingIndex.isInvalid')
      } else {
        return false
      }
    }),

  showDisplayError: computed('showValidations', 'ShowDisplayValidation', 'validation.bindingDisplay.isInvalid',
    function () {
      if (this.get('ShowDisplayValidation') || this.get('showValidations')) {
        return this.get('validation.bindingDisplay.isInvalid')
      } else {
        return false
      }
    }),

  showArgumentError: computed('showValidations', 'ShowArgumentValidation', 'validation.bindingArgument.isInvalid',
    function () {
      if (this.get('ShowArgumentValidation') || this.get('showValidations')) {
        return this.get('validation.bindingArgument.isInvalid')
      } else {
        return false
      }
    }),

  ShowUserError: computed('showValidations', 'validation.pbxUserId.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.pbxUserId.isInvalid')
      } else {
        return false
      }
    }),

  ShowParkibgLotError: computed('showValidations', 'validation.pbxParkingLotId.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.pbxParkingLotId.isInvalid')
      } else {
        return false
      }
    }),

  showBindingParkingLot: computed('item.bindingBehavior', function () {
    if (this.get('item.bindingBehavior') == 'park') {
      return true
    } else {
      this.get('item').set('pbxParkingLotId', null)
      return false
    }
  }),

  deleteDeviceBinding: task(function * () {
      yield this.get('deleteRecord')(this.get('item'))
    }
  ).drop(),

  resize: function () {
    $('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  didInsertElement () {
    this.get('resize')()
  },
  didDestroyElement () {
    this.get('resize')()
  },

  headerName: computed('item.bindingType', 'item.bindingDisplay', 'item.pbxUserId', 'usersProperties',
    'bindingTypeProperties', function () {
      let type = this.get('bindingTypeProperties')[this.get('item.bindingType')]
      let user = this.get('usersProperties')[this.get('item.pbxUserId')]
      let response = type ? `Device binding ${type} ` : 'Device binding'
      let display = this.get('item.bindingDisplay')
      if (display) {
        response = response + display
      } else if (user) {
        response = response + user
      }
      return response
    }),

  actions:
    {
      setPropertie (propertie, value) {
        this.get('item').set(propertie, value)
        return value
      },

      headerClick () {
        this.$('.accordion-header').toggleClass('open')
        this.$('.accordion-header').siblings('.accordion-collapse-block').slideToggle(
          'slow', function () {
            $('.sameblock').matchHeight._update()
          }
        )
        /*.parents('.sortable-objects').siblings()
                  .find('.accordion-collapse-block').hide(
                  'slow')
                  .siblings('.accordion-header').removeClass('open')*/
      }
    }

})
