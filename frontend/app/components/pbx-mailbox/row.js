import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  deleteMailbox: task(function * () {
      yield this.get('deleteRecord')(this.get('mailbox'))
    }
  ).drop(),

  didRender () {
    this.$('.td-collapse').hide()
  },

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
