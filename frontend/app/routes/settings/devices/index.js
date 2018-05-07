import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model () {
    return this.modelFor('settings.devices')
  },
  actions: {
    deleteRecord (location) {
      location.deleteRecord()
      return location.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete device. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    getPropertie (path) {
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL()
      return adapter.ajax(baseUrl + path, 'GET')
    }
  }
})
