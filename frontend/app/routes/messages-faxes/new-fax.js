import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  actions: {
    getContacts () {
      return this.get('store').findAll('contact')
    },

    rollBackContacts () {
      this.get('store').peekAll('contact').invoke('rollbackAttributes')
    },

    willTransition () {
      this.get('store').peekAll('contact').invoke('rollbackAttributes')
    },

    sendNewFaxes (params, file, subject, comment, cover) {
      let numbersToSend = this.get('store').peekAll('contact').filterBy('checked').mapBy('fax.number')
      if (typeof params == 'object') {
        let newContact = this.store.createRecord('contact', {
          firstName: params.firstName,
          lastName: params.lastName,
          org: params.company
        })
        newContact.get('telephone').createFragment({type: 'fax', number:params.fax})
        newContact.save().then(() => {
          this.get('notifications').success('Contact has saved successfully!', {
            autoClear: true,
            clearDuration: 6200
          })
        }, () => {
          this.get('notifications').error('Can not create contact. Please try later.', {
            autoClear: true,
            clearDuration: 6200
          })
        })
        numbersToSend.addObject(params.fax)
      } else {
        numbersToSend.addObject(params)
      }
      let calledNumbers = numbersToSend.join(';')
      return this.store.createRecord('newFax', {
        faxfile: file,
        calledNumber: calledNumbers,
        subject: subject,
        comment: comment,
        cover: cover
      }).save().then(() => {
        this.initializeCounts(this.controller.get('model'))
        this.get('notifications').success('Fax has sent successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('messages-faxes')
      }, () => {
        this.get('notifications').error('Can not sent fax. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
