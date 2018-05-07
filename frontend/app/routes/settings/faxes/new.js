import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),

  model () {
    return this.get('store').createRecord('pbxFax', {pbxAccountId: 1, extension: 1})
  },

  actions: {
    saveFax (changeset) {
      return changeset.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.faxes')
      }, () => {
        this.get('notifications').error('Can not create. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollbackFax (changeset) {
      changeset.rollback()
      this.transitionTo('settings.faxes')
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
