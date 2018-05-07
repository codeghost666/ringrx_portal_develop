import Route from '@ember/routing/route'
import Ember from 'ember'

export default Route.extend({
  notifications: Ember.inject.service('notification-messages'),
  model (params) {
    return this.get('store').peekRecord('contact', params.contact_id)
  },

  actions: {

    saveContact (contact) {
      contact.save().then(() => {
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('contacts')
      }, () => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollback (changeset) {
      changeset.rollbackAttributes()
      this.transitionTo('contacts')
    }
  }
})
