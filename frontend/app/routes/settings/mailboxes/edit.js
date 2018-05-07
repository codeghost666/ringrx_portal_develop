import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model (params) {
    return this.get('store').peekRecord('pbxMailbox', params.pbxMailbox_id)
  },

  actions: {
    updateMailbox: async function (changeset) {
      let token
      this.get('session.store').restore().then((data) => {
        token = data.authenticated.access_token
      })
      let response = {}
      let file = await changeset.get('greeting')
      return changeset.save().then(() => {
        if (file) {
          return file.upload(`/pbxmailboxes/${changeset.get('id')}/greeting`, {
            method: 'PATCH',
            headers: {'authorization': `Bearer ${token}`}
          })
        } else {
          return true
        }
      }).then(() => {
        changeset.set('greeting', '')
        this.modelFor(this.routeName).set('greeting', null)
        this.modelFor(this.routeName).set('currentSound', null)
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.mailboxes')
      }, (e) => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    playGreeting (model) {
      let urlPromice = model.download().then((content) => {
        let URL = window.URL || window.webkitURL
        return URL.createObjectURL(content)
      })
      return this.get('hifi').play(urlPromice)
    }
    ,

    rollbackMailbox (changeset) {
      changeset.rollback()
      this.transitionTo('settings.mailboxes')
    }
    ,

    willTransition () {
      let model = this.controller.get('model')

      if (model.get('isNew')) {
        model.send('becameInvalid')
        model.unloadRecord()
      }
    }
  }
})
