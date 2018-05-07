import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'

export default Component.extend({
  notifications: service('notification-messages'),
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\'\\d]+$'},

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

  saveButtonClick: task(function * () {
    let changeset = this.get('changeset')
    yield changeset.validate()
    if (changeset.get('isValid')) {
      yield this.get('save')(changeset)
    } else {
      let message = ''
      if (changeset.get('error').mediafile) {
        message = 'Please choose media file and try submitting again.'
      } else {
        message = 'Change a few things up and try submitting again.'
      }
      this.get('notifications').error(message, {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions: {
    setMediaFile: function () {
      var file = document.getElementById('file-field').files[0]
      let changeset = this.get('changeset')
      changeset.set('mediafile', file)
    },

    validateProperty (changeset, property,) {
      return this.get('changeset').validate(property)
    },

    rollback () {
      this.attrs.rollback(this.get('changeset'))
    }

  }
})
