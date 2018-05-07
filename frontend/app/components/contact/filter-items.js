import FilterContentComponent from 'ember-cli-filter-component/components/filter-content/component';
import { computed, observer } from '@ember/object';
import Ember from 'ember';
import config from '../../config/environment'

export default FilterContentComponent.extend({
  paginationProperty: config.paginationProperty,
  contactType: '',
  items: [],
  paginateBy: 10,

  init () {
    this._super()
    this.contactTypeFilter()
    this.applyFilter()
  },

  contactTypeFilter () {
    if (this.get('contactType') === '') {
      this.set('content', this.get('items'))
    } else {
      let contactType = this.get('contactType').toLowerCase()
      let filteredItems = this.get('items').filter(
        function (item) {
          return item.get('contactType').toLowerCase() == contactType
        })
      this.set('content', filteredItems)
    }
  },

  setContent: observer('items', 'contactType', function () {
    try {
      Ember.run.debounce(this, this.contactTypeFilter, parseInt(this.get('timeout'), 10), false)

    } catch (exception) {

      if (window.console) { window.console.error('setContent', exception) }
    }
  }),

  allType: computed('contactType', function () {
    return this.get('contactType') === ''
  }),

  actions: {
    setSelection (value) {
      this.set('contactType', value)
    },

    setProperty(propertie, value) {
      this.set(propertie, value);
      return value
    },
  }
})
