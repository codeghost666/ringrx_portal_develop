import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model (params) {
    return this.get('store').peekRecord('pbxuser', params.pbxuser_id)
  },
  actions: {
    updateUser (changeset) {
      return changeset.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.users')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollbackUser (changeset) {
      changeset.rollback()
      this.transitionTo('settings.users')
    },

    willTransition () {
      let model = this.controller.get('model')

      if (model.get('isNew')) {
        model.send('becameInvalid');
        model.unloadRecord();
      }
    }
  }
})
