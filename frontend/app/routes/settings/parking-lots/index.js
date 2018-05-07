import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model () {
    return this.modelFor('settings.parking-lots')
  },
  actions: {
    deleteParkingLot (parkingLot) {
      parkingLot.deleteRecord()
      parkingLot.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete parking lot. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
