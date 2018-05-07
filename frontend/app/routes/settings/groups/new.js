import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),

  model () {
    return this.get('store').createRecord('pbxGroup', {pbxAccountId: 1})
  },

  actions: {
    saveGroup (changeset) {
      return changeset.save().then((newGroup) => {
        newGroup.get('pbxGroupUsers').filterBy('id', null).invoke('deleteRecord')
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.groups')
      }, () => {
        this.get('notifications').error('Can not create. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    deleteGroupUser (user) {
      let model = this.controller.get('model')
      model.get('pbxGroupUsers').removeObject(user)
      user.unloadRecord()
    },

    addNewGroupUser () {
      let model = this.controller.get('model')
      let groupUser = this.get('store').createRecord('pbxGroupUser')
      model.get('pbxGroupUsers').addObject(groupUser)
    },

    rollbackGroup (changeset) {
      this.transitionTo('settings.groups')
    },

    willTransition () {
      let model = this.controller.get('model')
      model.get('pbxGroupUsers').filterBy('id', null).invoke('deleteRecord')
      if (model.get('isNew')) {
        model.send('becameInvalid')
        model.unloadRecord()
      }
    }
  }
})
