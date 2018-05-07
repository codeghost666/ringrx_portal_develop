import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model () {
    return this.modelFor('settings.mailboxes')
  },
  actions: {
    playGreeting (model) {
      let urlPromise = model.download().then((content) => {
        let URL = window.URL || window.webkitURL
        if (content){
          return URL.createObjectURL(content)
        } else {
          return Promise.reject({message: 'There is no file to play'})
        }
      })
      return this.get('hifi').play(urlPromise)
    },
    deleteRecord (mailbox) {
      mailbox.deleteRecord()
      return mailbox.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete mailbox. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
