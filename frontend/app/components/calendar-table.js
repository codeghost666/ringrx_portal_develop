import Component from '@ember/component'
import { computed } from '@ember/object'
import { on } from '@ember/object/evented'
import moment from 'moment'
import { A } from '@ember/array'

export default Component.extend({
  currentMonth: on('init', function () {
    this.set('currentMonth', moment().format('YYYY-M'))
  }),

  firstDayOfCalendar: computed('currentMonth', function () {
    let date = moment(moment(this.get('currentMonth'), 'YYYY-M').format('YYYY-WW'), 'YYYY-WW').day(0)
    return date
  }),
  lastDayOfCalendar: computed('currentMonth', function () {
    let lastMonthDay = moment(this.get('currentMonth'), 'YYYY-M').endOf('month')
    if (lastMonthDay.day() == 6) {
      return lastMonthDay
    } else {
      return lastMonthDay.day(6)
    }
  }),

  monthTable: computed('firstDayOfCalendar', function () {
    let firstDayOfCalendar = this.get('firstDayOfCalendar')
    let lastDayOfCalendar = this.get('lastDayOfCalendar')
    let days = lastDayOfCalendar.diff(firstDayOfCalendar, 'days') + 1
  }),
  actions: {
    nextMonth(){
      let nextMonth = moment(this.get('currentMonth'), 'YYYY-M').add(1, 'M').format('YYYY-M')
      this.set('currentMonth', nextMonth)
    },
    previousMonth(){
      let previousMonth = moment(this.get('currentMonth'), 'YYYY-M').add(-1, 'M').format('YYYY-M')
      this.set('currentMonth', previousMonth)
    }
  }
})
