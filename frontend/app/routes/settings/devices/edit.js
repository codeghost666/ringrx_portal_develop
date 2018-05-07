import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model (params) {
    return this.get('store').peekRecord('pbxDevice', params.pbxDevice_id)
  },

  deviceBindingsToDelete: Ember.A(),

  actions: {
    updateDevice (changeset) {
      return changeset.save().then((newDevice) => {
        newDevice.get('pbxDeviceBindings').filterBy('id', null).invoke('deleteRecord')
        let deviceBindings = this.get('deviceBindingsToDelete')
        if (deviceBindings.get('length') > 0) {
          return Promise.all(this.get('deviceBindingsToDelete').map(function (deviceBinding) {
            deviceBinding.deleteRecord()
            return deviceBinding.save()
          }))
        }
      }).then(() => {
        this.get('notifications').success('Updated successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.devices')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    deleteDeviceBinding (deviceBinding) {
      let model = this.controller.get('model')
      this.get('deviceBindingsToDelete').addObject(deviceBinding)
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

    rollbackDevice (changeset) {
      changeset.rollback()
      changeset.get('pbxDeviceBindings').invoke('rollbackAttributes')
      this.transitionTo('settings.devices')
    },

    willTransition () {
      let model = this.controller.get('model')
      this.get('store').peekAll('pbxDeviceBinding').filterBy('id', null).invoke('deleteRecord')
      if (model.get('isNew')) {
        model.send('becameInvalid')
        model.unloadRecord()
      }
    }
  }
})
