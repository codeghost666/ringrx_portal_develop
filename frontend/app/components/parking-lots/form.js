import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'

export default Component.extend({
  notifications: service('notification-messages'),
  mohProperties: {},
  timeoutExtensionProperties: {},

  initProperties: on('init', function () {
    this.model.getMohs().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'mohProperties', response)
      }
    })
    this.model.getTimeoutExtensions().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'timeoutExtensionProperties', response)
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
