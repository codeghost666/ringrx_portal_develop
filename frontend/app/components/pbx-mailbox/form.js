import Component from '@ember/component'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'
import Ember from 'ember'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'

export default Component.extend({
  notifications: service('notification-messages'),
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\'\\d]+$'},
  haveGreeting: false,

  initStatus: on('init', function(){
    if (this.get('model.id')){
      this.get('model').getStatus().then((response)=>{
        if (!this.isDestroyed && response[0]) {
          trySet(this, 'haveGreeting', !Ember.isEmpty(response[0].greeting))
          Ember.run.schedule('afterRender', this, this.resize)
        }
      })
    }
  }),

  didInsertElement () {
    this.resize()
  },
  didDestroyElement () {
    this.resize()
  },

  resize(){
    $.fn.matchHeight._maintainScroll = true;
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
      if (changeset.get('error').greeting) {
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
    setGreeting: async function (file) {
      let changeset = this.get('changeset')
      changeset.set('greeting', file)
      let url = await file.readAsDataURL()
      file.set('url', url)
    },

    validateProperty (changeset, property,) {
      return this.get('changeset').validate(property)
    },

    rollback () {
      this.attrs.rollback(this.get('changeset'))
    }

  }
})
