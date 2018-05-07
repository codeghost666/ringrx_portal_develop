import Component from '@ember/component'
import Ember from 'ember'

export default Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  tagName: 'tr',
  didRender () {
    this.$('.td-collapse').hide()
  },

  actions: {
    toInbox () {
      let message = this.get('message')
      this.get('updateMessage')(message, 'messageFolder', 'inbox').then(() => {
        this.get('notifications').success('Moved to inbox successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        message.rollbackAttributes()
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
