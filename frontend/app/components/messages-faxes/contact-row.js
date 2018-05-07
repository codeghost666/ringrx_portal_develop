import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  didInsertElement () {
    this.$('.td-collapse').hide()
  },

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
