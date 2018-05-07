import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model (params) {
    return this.get('store').peekRecord('pbxParkingLot', params.pbxParkingLot_id)
  },
  actions: {
    updateParkingLot (changeset) {
      return changeset.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.parking-lots')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollbackParkingLot (changeset) {
      changeset.rollback()
      this.transitionTo('settings.parking-lots')
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
