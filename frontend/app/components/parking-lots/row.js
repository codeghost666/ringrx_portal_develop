import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  didRender () {
    this.$('.td-collapse').hide()
  },
  deleteParkingLot: task(function * () {
      yield this.get('deleteRecord')(this.get('parkingLot'))
    }
  ).drop(),

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
