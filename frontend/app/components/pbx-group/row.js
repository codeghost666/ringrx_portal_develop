import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  pbxUserProperties: {},
  tagName: 'tr',

  didRender () {
    this.$('.td-collapse').hide()
  },
  deleteGroup: task(function * () {
      yield this.get('deleteRecord')(this.get('group'))
    }
  ).drop(),

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
