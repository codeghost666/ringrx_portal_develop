import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  didRender () {
    this.$('.td-collapse').hide()
  },
  deleteFax: task(function * () {
      yield this.get('deleteRecord')(this.get('fax'))
    }
  ).drop(),

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
