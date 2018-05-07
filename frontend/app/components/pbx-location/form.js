import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'

export default Component.extend({
  notifications: service('notification-messages'),
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\']+$'},
  addressMask: {regex: '^[a-zA-Z\\s-_\\d.]+$'},
  zipMask: {regex: '^[\\d-]{5,10}$'},

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

  didInsertElement(){
    $.fn.matchHeight._maintainScroll = true;
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

   actions:
    {
      validateProperty (changeset, property,) {
        return this.get('changeset').validate(property)
      },

      rollback () {
        this.attrs.rollback(this.get('changeset'))
      }
    }
})
