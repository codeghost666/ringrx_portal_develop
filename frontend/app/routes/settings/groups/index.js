import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  model () {
    return this.modelFor('settings.groups')
  },
  actions: {
    deleteRecord (group) {
      group.deleteRecord()
      return group.save().then((deletedRecord) => {
        deletedRecord.get('pbxGroupUsers').invoke('unloadRecord')
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete group. Please try later.', {
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
