import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import Ember from 'ember'

export default Route.extend({
  notifications: service('notification-messages'),

  model (params) {
    return this.get('store').peekRecord('pbxGroup', params.pbxGroup_id)
  },

  groupUsersToDelete: Ember.A(),

  actions: {
    updateGroup (changeset) {
      return changeset.save().then((newGroup) => {
        newGroup.get('pbxGroupUsers').filterBy('id', null).invoke('deleteRecord')
        let groupUsers = this.get('groupUsersToDelete')
        if (groupUsers.get('length') > 0) {
          return Promise.all(this.get('groupUsersToDelete').map(function (groupUser) {
            groupUser.deleteRecord()
            return groupUser.save()
          }))
        }
      }).then(() => {
        this.get('notifications').success('Updated successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.groups')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    deleteGroupUser (user) {
      let model = this.controller.get('model')
      this.get('groupUsersToDelete').addObject(user)
      model.get('pbxGroupUsers').removeObject(user)
    },

    addNewGroupUser (changeset) {
      let groupUser = this.get('store').createRecord('pbxGroupUser', {pbxGroupId: changeset.get('id')})
      changeset.get('pbxGroupUsers').addObject(groupUser)
    },

    rollbackGroup (changeset) {
      changeset.rollback()
      changeset.get('pbxGroupUsers').invoke('rollbackAttributes')
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
