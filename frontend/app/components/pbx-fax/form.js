import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'

export default Component.extend({
  notifications: service('notification-messages'),
  phonenumberProperties: {},
  formatProperties: {},
  destinationTypesProperties: {},
  mailboxProperties: {},
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},

  initProperties: on('init', function () {
    this.model.getPhonenumbers().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'phonenumberProperties', response)
      }
    })
    this.model.getFormats().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'formatProperties', response)
      }
    })
    this.model.getDestinationTypes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'destinationTypesProperties', response)
      }
    })
    this.model.getMailboxes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'mailboxProperties', response)
      }
    })
  }),

  saveButtonClick: task(function * () {
    let changeset = this.get('changeset')
    yield changeset.validate()
    if (changeset.get('isValid')) {
      yield this.get('save')(changeset)
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  didInsertElement () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },
  didDestroyElement () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  actions:
    {
      validateProperty (changeset, property,) {
        if (changeset.get(property) === '_@_._') {
          changeset.set(property, '')
        }
        return this.get('changeset').validate(property)
      },

      setPropertie (propertie, value) {
        this.get('changeset').set(propertie, value)
        return value
      },

      rollback () {
        this.attrs.rollback(this.get('changeset'))
      }
    }
})
