import Component from '@ember/component'
import { computed } from '@ember/object'
import { on } from '@ember/object/evented'
import { task } from 'ember-concurrency'

export default Component.extend({

  save: task(function * () {
    yield this.get('saveChanges')(this.get('message')).then(() => {this.sendAction('closeMessageDialog')}, () => {})
  }).drop(),

  willDestroyElement () {
    this.get('message').rollbackAttributes()
  },

  actions: {
    rollback () {
      this.sendAction('closeMessageDialog')
    },
  }
})
