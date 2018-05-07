import Route from '@ember/routing/route'
import Ember from 'ember'

export default Route.extend({
  notifications: Ember.inject.service('notification-messages'),
  model () {
    let contact = this.get('store').createRecord('contact', {})
    contact.get('telephone').createFragment({type: 'phone'})
    contact.get('telephone').createFragment({type: 'fax'})
    return contact
  },

  setupController (controller, model) {
    this._super(controller, model)
    controller.set('buttonLabel', 'Save Contact')
    controller.set('formTitle', 'Create New Contact')
  },

  actions: {

    saveContact (newContact) {
      return newContact.save().then(() => {
        this.get('notifications').success('New contact was created!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('contacts')
      }, () => {
        this.get('notifications').error('Could not save. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollback (changeset) {
      changeset.rollbackAttributes()
      this.transitionTo('contacts')
    },

    willTransition () {
      let model = this.controller.get('model')

      if (model.get('isNew')) {
        model.send('becameInvalid');
        model.unloadRecord();
      }
    }
  }
})
