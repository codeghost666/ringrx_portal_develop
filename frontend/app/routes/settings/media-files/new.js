import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model () {
    return this.get('store').createRecord('pbxMediaFile', {pbxAccountId: 1})
  },

  actions: {
    createMediaFile (changeset) {
      return changeset.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.media-files')
      }, () => {
        this.get('notifications').error('Can not create. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },
    playMediaFile (model) {
      return Promise.reject()
    },

    rollbackMediaFile (changeset) {
      changeset.rollback()
      this.transitionTo('settings.media-files')
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
