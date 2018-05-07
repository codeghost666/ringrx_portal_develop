import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model () {
    return this.get('store').createRecord('pbxMailbox', {pbxAccountId: 1})
  },

  actions: {
    createMailbox: async function (changeset) {
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
        this.get('notifications').error('Can not create. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    playGreeting (model) {
      return Promise.reject()
    },

    rollbackMailbox (changeset) {
      changeset.rollback()
      this.transitionTo('settings.mailboxes')
    },

    willTransition () {
      let model = this.controller.get('model')

      if (model.get('isNew')) {
        model.send('becameInvalid')
        model.unloadRecord()
      }
    }
  }
})
