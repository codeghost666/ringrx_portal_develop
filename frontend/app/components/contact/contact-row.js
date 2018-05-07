import Component from '@ember/component';
import { computed } from '@ember/object'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  didInsertElement () {
    this.$('.td-collapse').hide()
  },

  deleteContact: task(function * () {
      yield this.get('deleteRecord')(this.get('contact'))
    }
  ).drop(),
  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})

