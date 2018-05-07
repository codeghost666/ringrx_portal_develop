import Route from '@ember/routing/route'
import {inject as service} from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),

  model() {
    return this.get('store').createRecord('pbxDevice', {pbxAccountId: 1})
  },

  actions: {
    saveDevice(changeset) {
      return changeset.save().then((newDevice) => {
        newDevice.get('pbxDeviceBindings').filterBy('id', null).invoke('deleteRecord')
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.devices')
      }, () => {
        this.get('notifications').error('Can not create. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    deleteDeviceBinding (deviceBinding) {
      let model = this.controller.get('model')
      model.get('pbxDeviceBindings').removeObject(deviceBinding)
      model.get('pbxDeviceBindings').sortBy('bindingIndex').forEach((binding, index) => {
        binding.set('bindingIndex', index + 1)
      })
    },

    addNewDeviceBinding (changeset) {
      let count = changeset.get('pbxDeviceBindings.length')
      let groupUser = this.get('store').createRecord('pbxDeviceBinding', {
        pbxDeviceId: changeset.get('id'),
        bindingIndex: count + 1
      })
      changeset.get('pbxDeviceBindings').addObject(groupUser)
    },

    rollbackDevice(changeset) {
      this.transitionTo('settings.devices')
    },

    willTransition() {
      let model = this.controller.get('model');
      model.get('pbxDeviceBindings').filterBy('id', null).invoke('deleteRecord');
      if (model.get('isNew')) {
        model.send('becameInvalid');
        model.unloadRecord()
      }
    }
  }
})
