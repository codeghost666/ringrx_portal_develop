import Component from '@ember/component'
import Ember from 'ember'
import moment from 'moment'
import { computed } from '@ember/object'
import { on } from '@ember/object/evented'
import config from '../../config/environment'
import PbxAudit from '../../models/pbx-audit'

export default Component.extend({
  model: [],
  startDate: '',
  endDate: '',
  formatDate: 'DD-MM-YYYY',
  paginateBy: 10,
  paginationProperty: config.paginationProperty,

  initDates: on('init', function () {
    let startDate = moment().subtract(30, 'day')
    let endDate = moment()
    this.set('startDate', startDate)
    this.set('endDate', endDate)
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
  items: computed('model.length', 'startDate', 'endDate', function () {
    return this.get('model').filter((item) => {
      return moment(item.get('createdAt')).isBetween(this.get('startDate'), this.get('endDate'))
    })
  }),

  didInsertElement () {
    this.$('.input-daterange').datepicker({})
    this.resize()
  },
  didDestroyElement () {
    this.resize()
  },
  resize () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  actions: {
    setProperty (propertie, value) {
      this.set(propertie, value)
      Ember.run.schedule('afterRender', this, this.get('resize'))
      return value
    },

    getCSV (data) {
      let keys = Ember.get(PbxAudit, 'attributes')._keys.list
      let normalizedData = [keys]
      data.forEach((callRecord) => {
        normalizedData.push(keys.map((key) => callRecord.get(key)))
      })
      this.get('csv').export(normalizedData, {fileName: 'auditLog.csv'})
    }
  }
})


