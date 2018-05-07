import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model (params) {
    return this.get('store').peekRecord('pbxLocation', params.pbxLocation_id)
  },
  actions: {
    updateLocation (changeset) {
      return changeset.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.locations')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollbackLocation (changeset) {
      changeset.rollback()
      this.transitionTo('settings.locations')
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
