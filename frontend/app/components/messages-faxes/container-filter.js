import FilterContentComponent from 'ember-cli-filter-component/components/filter-content/component'
import { computed, observer } from '@ember/object'
import Ember from 'ember'
import moment from 'moment'
import config from '../../config/environment'

export default FilterContentComponent.extend({
  paginationProperty: config.paginationProperty,
  messageFolder: '',
  messageType: '',
  startDate: '',
  endDate: '',
  items: [],
  isFilteredByDate: false,
  paginateBy: 10,


  init () {
    this._super()
    this.messageTypeFilter()
    this.applyFilter()
  },

  willFilterByDate: observer('startDate', 'endDate', function(){
    this.set('isFilteredByDate', true)
  }),
  updateNewCount(){
    let newMessages = this.get('filteredItemsByForlder').filterBy('status', 'new').get('length')
    Ember.$('a#messages-faxes').text(`MESSAGES & FAXES(${newMessages})`)
    Ember.$('a#messages-faxes-mobile').text(`MESSAGES & FAXES(${newMessages})`)
  },

  newMessageCountObserver: observer('items.@each.status', function(){
    if (this.get('messageFolder').toLowerCase() == 'inbox') {
      Ember.run.schedule('afterRender', this, this.get('updateNewCount'))
    }
  }),

  filteredItemsByForlder: computed('items.@each.messageFolder', 'items.@each.status', function () {
    let messageFolder = this.get('messageFolder').toLowerCase()
    let filteredItems = this.get('items').filter(
      function (item) {
        return item.get('messageFolder').toLowerCase() === messageFolder
      })
    if (messageFolder == 'inbox') {
      let newMessages = filteredItems.filterBy('status', 'new').get('length')
      Ember.run.schedule('afterRender', this, this.get('updateNewCount'))
    }
    return filteredItems
  }),

  filteredItemsByDate: computed('filteredItemsByForlder', 'startDate', 'endDate', function () {
    if (this.get('isFilteredByDate')){
      return this.get('filteredItemsByForlder').filter((item) => {
        return moment(item.get('createdAt')).isBetween(this.get('startDate'), this.get('endDate'))
      })
    } else {
      return this.get('filteredItemsByForlder')
    }
  }),

  messageTypeFilter () {
    if (this.get('messageType') === '') {
      this.set('content', this.get('filteredItemsByDate'))
    } else {
      let messageType = this.get('messageType').toLowerCase()
      let filteredItems = this.get('filteredItemsByDate').filter(
        function (item) {
          return item.get('messageType').toLowerCase() === messageType
        })
      this.set('content', filteredItems)
    }
  },

  setContent: observer('items.@each.messageFolder', 'messageType', 'startDate', 'endDate', function () {
    try {
      Ember.run.debounce(this, this.messageTypeFilter, parseInt(this.get('timeout'), 10), false)

    } catch (exception) {

      if (window.console) { window.console.error('setContent', exception) }
    }
  }),

  startDateToJSDate: computed('startDate', {
    get (key) {
      return this.get('startDate').toDate()
    },
    set (key, value) {
      this.set('startDate', moment(value))
      return value
    }
  }),

  endDateToJSDate: computed('endDate', {
    get (key) {
      return this.get('endDate').toDate()
    },
    set (key, value) {
      this.set('endDate', moment(value))
      return value
    }
  }),

  allType: computed('messageType', function () {
    return this.get('messageType') === ''
  }),

  didInsertElement () {
    this.$('.input-daterange').datepicker({})
  },

  actions: {
    setSelection (value) {
      this.set('messageType', value)
    },

    setProperty(propertie, value) {
      this.set(propertie, value);
      return value
    },
  }
})
