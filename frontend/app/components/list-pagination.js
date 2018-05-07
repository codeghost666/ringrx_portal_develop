import Component from '@ember/component';
import { computed } from '@ember/object';
import { on } from '@ember/object/evented';
import config from '../config/environment'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  tagName: 'table',
  classNames: 'base-table',
  items: [],
  page: 1,
  paginateBy: 10,

  paginatedItems: computed('items.length', 'page', 'paginateBy', function () {
    var i = (parseInt(this.get('page')) - 1) * parseInt(this.get('paginateBy'))
    var j = i + parseInt(this.get('paginateBy'))
    return this.get('items').filter(function (item, index) {
      return (index >= i) && (index < j)
    })
  }),

  numberOfPages: computed('page', 'items.length', 'paginateBy', function () {
    var n = this.get('items').get('length')
    var c = parseInt(this.get('paginateBy'))
    var r = Math.floor(n / c)
    if ((n % c > 0) && n != 0) {
      r += 1
    }
    return r
  }),

  updatePageNumber: on('didUpdateAttrs', function () {
    this.set('page', 1)
  })
})
