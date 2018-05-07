import Component from '@ember/component'
import { on } from '@ember/object/evented'
import Ember from 'ember'
import { computed } from '@ember/object'
import { trySet } from '@ember/object'
import { inject as service } from '@ember/service'

export default Component.extend({

session: service(),
  startDate: '',
  endDate: '',
  userProperties: {},
  classNames: 'col-xs-12',

  oncall: computed('oncallId', function () {
    Ember.run.schedule('afterRender', this, function () {
      $('.week-schedule  .item-coll').matchHeight({
        byRow: false,
        property: 'height',
        target: null,
        remove: false
      })
    })
    return this.get('oncalls').findBy('id', this.get('oncallId'))
  }),

  oncallProperties: computed('oncalls.length', 'oncalls.@each.id', function () {
    let properties = {}
    this.get('oncalls').forEach((oncall) => {
      properties[oncall.get('id')] = oncall.get('name')
    })
    return properties
  }),

  initDates: on('init', function () {
    this.set('startDate', moment().day(0))
    this.set('endDate', moment().day(6))
  }),

  initUserProperties: on('init', function () {
    if (!Ember.isEmpty(this.get('oncall'))) {
      this.get('oncall').getPbxUsers().then((response) => {
        if (!this.isDestroyed) {
          trySet(this, 'userProperties', response)
          Ember.run.schedule('afterRender', this, function () {
            $('.week-schedule  .item-coll').matchHeight({
              byRow: false,
              property: 'height',
              target: null,
              remove: false
            })
          })
        }
      })
    }
  }),

  didInsertElement () {
    let day = moment().format('d')
    let date = moment().format('YYYY-MM-DD')
    this.$(this.$('tr')[day]).addClass('today')
    this.$(`#${date}`).addClass('today')
  },

  weekTable: computed('startDate', 'endDate', function () {
    let firstDayOfTable = this.get('startDate')
    let weekTable = {}
    let currentTableDate = moment(firstDayOfTable.format())
    for (let j = 0; j < 7; j++) {
      weekTable[currentTableDate.format('YYYY-MM-DD')] = Ember.A()
      currentTableDate.add(1, 'day')
    }

    return weekTable
  }),

  oncallWeek: computed('oncall', 'startDate', 'EndDate', function () {
    let firstDayOfTable = this.get('startDate')
    let LastDayOfTable = this.get('endDate')
    let weekTable = this.get('weekTable')
    let currentTableDate = moment(firstDayOfTable.format())
    for (let j = 0; j < 7; j++) {
      weekTable[currentTableDate.format('YYYY-MM-DD')].removeObjects(weekTable[currentTableDate.format('YYYY-MM-DD')])
      currentTableDate.add(1, 'day')
    }
    if (!Ember.isEmpty(this.get('oncall'))) {
      this.get('oncall.pbxOncallShifts').filter((shift) => {
          if (shift.get('startAt')) {
            let startAt = moment(shift.get('startAt'))
            return startAt.isBetween(firstDayOfTable, LastDayOfTable)
          } else {
            return true
          }
        }
      ).forEach((shift) => {
        if (shift.get('startAt')) {
          let key = moment(shift.get('startAt')).format('YYYY-MM-DD')
          weekTable[key].addObject(shift)
        } else {
          let startDate = moment(firstDayOfTable)
          let key = startDate.format('YYYY-MM-DD')
          for (let i = 0; i < 7; i++) {
            let weekDay = startDate.format('ddd')
            if (shift.get(`day${weekDay}`)) {
              weekTable[key].addObject(shift)
            }
            key = startDate.add(1, 'day').format('YYYY-MM-DD')
          }
        }
      })
    }
    return weekTable
  }),

  actions: {
    setProperty (key, value) {
      this.set(key, value)
    },
  }
})
