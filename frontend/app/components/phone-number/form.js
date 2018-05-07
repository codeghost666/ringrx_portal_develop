import Component from '@ember/component'
import Ember from 'ember'
import { computed, observer, trySet } from '@ember/object'
import { on } from '@ember/object/evented'

export default Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  statusSpinner: false,
  timeout: 3000,
  distinctiveRingProperties: {},
  PbxLocationProperties: {},
  extensionProperties: {},

  didInsertElement(){
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
  },
  didDestroyElement(){
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
  },

  initProperties: on('init', function () {
    this.model.getExtensions().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'extensionProperties', response)
      }
    })
    this.model.getDistinctiveRing().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'distinctiveRingProperties', response)
      }
    })

    this.model.getLocations().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'PbxLocationProperties', response)
      }
    })
  }),

  savePhoneNumber () {
    let changeset = this.get('changeset')
    changeset.validate().then(() => {
      if (changeset.get('isValid')) {
        this.get('save')(changeset).finally(() => {
          this.set('statusSpinner', false)
        })
      } else {
        this.get('notifications').error('Change a few things up and try submitting again.', {
          autoClear: true,
          clearDuration: 6200
        })
        this.set('statusSpinner', false)
      }
    })
  },
  forwardObserver: observer('changeset.forward', function () {
    if (!this.get('changeset').get('forward')) {
      this.get('changeset').set('forwardDestination', '')
    } else {
      this.get('changeset').set('forwardDestination', this.get('model').get('forwardDestination'))
    }
    this.actions.validateProperty(this.get('changeset'), 'forwardDestination')
  }),

  actions:
    {
      validateProperty (changeset, property,) {
        return changeset.validate(property)
      },

      setDistinctiveRing (value) {
        this.get('changeset').set('distinctiveRing', value)
        return value
      },
      setExtensionPropertie (value) {
        this.get('changeset').set('extension', value)
        return value
      },

      setPbxLocationId (value) {
        this.get('changeset').set('pbxLocationId', value)
        return value
      },

      rollback () {
        this.attrs.rollback(this.get('changeset'))
      },

      saveButtonClick () {
        if (!this.get('statusSpinner')) {
          this.set('statusSpinner', true)
          try {
            Ember.run.debounce(this, this.savePhoneNumber, parseInt(this.get('timeout'), 10), false)

          } catch (exception) {

            if (window.console) { window.console.error('saveButtonClick', exception) }
          }
        }
      },
    }
})

