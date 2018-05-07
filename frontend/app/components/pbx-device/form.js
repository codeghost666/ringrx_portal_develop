import Component from '@ember/component'
import {task} from 'ember-concurrency'
import {inject as service} from '@ember/service'
import Ember from 'ember'
import {on} from '@ember/object/evented'
import {trySet, computed, observer} from '@ember/object'
import {collectionAction} from "ember-api-actions";

export default Component.extend({
  notifications: service('notification-messages'),
  deviceTypeProperties: {},
  bindingTypeProperties: {},
  bindingBehaviorProperties: {},
  usersProperties: {},
  parkingLotProperties: {},
  signalingProperties: {},
  validation: null,
  showValidations: false,
  ShowNameValidation: false,
  ShowMacaddressValidation: false,
  ShowDisplayNameValidation: false,
  ShowSignalingValidation: false,
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},
  macAddressMask: {regex: '^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$'},

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('model.validations.attrs'));
    this.model.getDeviceTypes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'deviceTypeProperties', response)
      }
    });
    this.model.getBindingTypes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'bindingTypeProperties', response)
      }
    });
    this.model.getBindingBehaviors().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'bindingBehaviorProperties', response)
      }
    });
    this.model.getPbxUsers().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'usersProperties', response)
      }
    });
    this.model.getPbxParkingLots().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'parkingLotProperties', response)
      }
    })
    this.model.getSignaling().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'signalingProperties', response)
      }
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

  ShowDeviceTypeError: computed('showValidations', 'validation.deviceType.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.deviceType.isInvalid')
      } else {
        return false
      }
    }),

  ShowMacaddressError: computed('showValidations', 'ShowMacaddressValidation', 'validation.macaddress.isInvalid',
    function () {
      if (this.get('ShowMacaddressValidation') || this.get('showValidations')) {
        return this.get('validation.macaddress.isInvalid')
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

  ShowDisplayNameError: computed('showValidations', 'ShowDisplayNameValidation', 'validation.displayName.isInvalid',
    function () {
      if (this.get('ShowDisplayNameValidation') || this.get('showValidations')) {
        return this.get('validation.displayName.isInvalid')
      } else {
        return false
      }
    }),

  ShowsignalingError: computed('showValidations', 'ShowSignalingValidation', 'validation.signaling.isInvalid',
    function () {
      if (this.get('ShowSignalingValidation') || this.get('showValidations')) {
        return this.get('validation.signaling.isInvalid')
      } else {
        return false
      }
    }),


  saveButtonClick: task(function* () {
    this.set('showValidations', true);
    let model = this.get('model');
    if (model.get('validations.isValid')) {
      yield this.get('save')(model)
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  AddDeviceBinding: task(function * () {
      yield this.get('addNewBindingDevice')(this.get('model'))
    }
  ).drop(),

  didInsertElement() {
    this.get('resize')()
    $('.sortable-objects:first .accordion-collapse-block').show();
    $('.sortable-objects:not(:first) .accordion-collapse-block').hide();
  },
  didDestroyElement() {
    this.get('resize')()
  },
  resize: function () {
    $.fn.matchHeight._maintainScroll = true;
    $('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  orderedDeviceBindings: computed('model.pbxDeviceBindings', 'model.pbxDeviceBindings.@each.bindingIndex', 'model.pbxDeviceBindings.[]', 'model.pbxDeviceBindings.length', {
    get(key) {
      return this.get('model.pbxDeviceBindings').sortBy('bindingIndex')
    },
    set(key, value) {
      (value).forEach((binding, index)=>{
        binding.set('bindingIndex', index + 1)
      })

      return value;
    }
  }),

  actions:
    {
      setPropertie(propertie, value) {
        this.get('model').set(propertie, value);
        return value
      },

      rollback() {
        this.attrs.rollback(this.get('model'))
      },

      resize(){
        Ember.run.schedule( 'afterRender', this, function () {
          this.get('resize')()
        })

      }
    }
})
