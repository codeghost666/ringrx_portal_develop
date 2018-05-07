import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model () {
    return this.modelFor('contacts')
  },
  actions: {
    deleteRecord (contact) {
      contact.deleteRecord()
      contact.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete contact. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
