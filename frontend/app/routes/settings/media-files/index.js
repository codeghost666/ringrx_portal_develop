import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model () {
    return this.modelFor('settings.media-files')
  },
  actions: {
    playMediaFile (model) {
      let urlPromise = model.download().then((content) => {
        let URL = window.URL || window.webkitURL
        return URL.createObjectURL(content)
      })
      return this.get('hifi').play(urlPromise)
    },
    deleteRecord (mediaFile) {
      mediaFile.deleteRecord()
      return mediaFile.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete media file. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
