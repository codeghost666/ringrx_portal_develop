import Component from '@ember/component'
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { collectionAction } from 'ember-api-actions'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'

export default Component.extend({
  notifications: service('notification-messages'),
  mohProperties: {},
  mediafileProperties: {},
  mailboxProperties: {},
  phonenumberProperties: {},

  initUserProperties: on('init', function () {
    this.getProperty('getMoh', 'mohProperties')
    this.getProperty('getMediafiles', 'mediafileProperties')
    this.getProperty('getMailboxes', 'mailboxProperties')
    this.getProperty('getPhonenumbers', 'phonenumberProperties')
  }),

  getProperty (name, property) {
    this.get(name)().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, property, response)
      }
    })
  },

  willDestroyElement(){
    this.get('model').filterBy('id', null).invoke('deleteRecord')
    this.get('model').filterBy('id').invoke('rollbackAttributes')
  },


  isHaveNew: computed('newOncall', function () {
    return !Ember.isEmpty(this.get('newOncall'))
  }),

  newOncall: computed('model.length', 'model.@each.id', function () {
    return this.get('model').toArray().findBy('id', null)

  }),

  existsOncall: computed('model.length', 'model.@each.id', function () {
    return this.get('model').filterBy('id')
  }),

  addDepartment: task(function * () {
    if (!this.get('isHaveNew')) {
      yield this.get('getNewOncall')().then(() => {
      }, () => {
        this.get('notifications').error('Can not add new department. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    } else {
      this.get('notifications').info('There is new department. Please save it and then add new.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions: {
    rollback () {
      this.sendAction('closeDialog')
    },
  }
})
