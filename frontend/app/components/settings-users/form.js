import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { on } from '@ember/object/evented'
import { inject as service } from '@ember/service'
import { collectionAction } from 'ember-api-actions'
import { trySet } from '@ember/object'
import Ember from 'ember'

export default Component.extend({
  notifications: service('notification-messages'),
  forwardProperties: {},
  faxExtensionProperties: {},
  mailboxProperties: {},
  roleProperties: {},
  locationProperties: {},
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-\']+$'},
  usernameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\\d]+$'},
  resize: function () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  initProperties: on('init', function () {
    this.model.getForward().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'forwardProperties', response)
      }
    })
    this.model.getFaxExtensions().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'faxExtensionProperties', response)
      }
    })
    this.model.getMailboxes().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'mailboxProperties', response)
      }
    })
    this.model.getRoles().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'roleProperties', response)
      }
    })

    this.model.getLocations().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'locationProperties', response)
      }
    })
  }),

  saveButtonClick: task(function * () {
    let changeset = this.get('changeset')
    yield changeset.validate()
    if (changeset.get('isValid')) {
      yield this.get('save')(changeset)
    } else {
      Ember.run.schedule('afterRender', this, function () {
          this.get('resize')()
        }
      )
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  didInsertElement () {
    this.get('resize')()
  },
  didDestroyElement () {
    this.get('resize')()
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
