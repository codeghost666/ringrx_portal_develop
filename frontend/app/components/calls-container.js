import Component from '@ember/component'
import moment from 'moment'
import { computed } from '@ember/object'
import config from '../config/environment'
import Cdr from '../models/cdr'
import Ember from 'ember'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  startDate: null,
  endDate: null,
  model: null,
  formatDate: 'DD-MM-YYYY',
  paginateBy: 10,

  // Newest first
  orderModel: computed.sort('model', function (a, b) {
    if (moment(b.get('startTime')).isBefore(a.get('startTime'))) {
      return -1
    } else if (moment(a.get('startTime')).isBefore(b.get('startTime'))) {
      return 1
    }

    return 0
  }),

  startDateToJSDate: computed('startDate', {
    get (key) {
      return moment(this.get('startDate'), this.get('formatDate')).toDate()
    },
    set (key, value) {
      this.set('startDate', moment(value).format(this.get('formatDate')))
      return value
    }
  }),

  endDateToJSDate: computed('endDate', {
    get (key) {
      return moment(this.get('endDate'), this.get('formatDate')).toDate()
    },
    set (key, value) {
      this.set('endDate', moment(value).format(this.get('formatDate')))
      return value
    }
  }),

  didInsertElement () {
    this.$('.input-daterange').datepicker({})
  },

  actions: {
    setProperty (propertie, value) {
      this.set(propertie, value)
      return value
    },

    getCSV (data) {
      let keys = Ember.get(Cdr, 'attributes')._keys.list
      let normalizedData = [keys]
      data.forEach((callRecord) => {
        normalizedData.push(keys.map((key) => callRecord.get(key)))
      })
      this.get('csv').export(normalizedData, {fileName: 'CallRecord.csv'})
    }
  }
})


