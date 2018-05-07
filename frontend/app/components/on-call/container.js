import Component from '@ember/component'
import { computed, observer } from '@ember/object'
import { on } from '@ember/object/evented'
import moment from 'moment'
import { A } from '@ember/array'
import Ember from 'ember'
import { trySet } from '@ember/object'
import { inject as service } from '@ember/service'
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver'

export default Component.extend(FileSaverMixin, {
  notifications: service('notification-messages'),
  oncallId: null,
  startDate: '',
  endDate: '',
  showAsCalendar: true,
  isCopyMode: false,
  isEditDayDialog: false,
  isEditRepeatDialog: false,
  isManageDepartments: false,
  formatDate: 'DD-MM-YYYY',
  userProperties: {},
  currentDate: '',
  printThisOptions: computed('currentMonth', function () {
    return {
      importCSS: true,
      importStyle: true,
      pageTitle: moment(this.get('currentMonth'), 'YYYY-M').format('MMMM, YYYY')
    }
  }),

  initDates: on('init', function () {
    let startDate = moment()
    let endDate = moment().add(30, 'day')
    this.set('startDate', startDate)
    this.set('endDate', endDate)
  }),

  currentMonth: on('init', function () {
    this.set('currentMonth', moment().format('YYYY-M'))
  }),

  initUserProperties: on('init', function () {
    if (!Ember.isEmpty(this.get('oncall'))) {
      this.get('oncall').getPbxUsers().then((response) => {
        if (!this.isDestroyed) {
          trySet(this, 'userProperties', response)
        }
      })
    }
  }),

  oncall: computed('oncallId', function () {
    return this.get('model').findBy('id', this.get('oncallId'))
  }),

  oncallProperties: computed('model.length','model.@each.id', function () {
    let properties = {}
    this.get('model').forEach((oncall) => {
      properties[oncall.get('id')] = oncall.get('name')
    })
    return properties
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

  didInsertElement () {
    this.$('.input-daterange').datepicker({})
    this.calendarView()
    Ember.$(window).resize(() => {
      if ($('div').is('.calendar')) {
        this.calendarView()
      }
    })
  },

  calendarView () {
    var windowWidth = Ember.$(document).width()

    function get_name_browser () {
      var ua = navigator.userAgent
      if (ua.search(/Chrome/) > 0) return 'Google Chrome'
      if (ua.search(/Firefox/) > 0) return 'Firefox'
      if (ua.search(/Opera/) > 0) return 'Opera'
      if (ua.search(/Safari/) > 0) return 'Safari'
      if (ua.search(/MSIE/) > 0) return 'Internet Explorer'
      return 'Не определен'
    }

    var browser = get_name_browser(),
      rezalution
    if (browser == 'Safari') {
      rezalution = 991
    }
    else
      rezalution = 976

    if (windowWidth <= rezalution) {
      if (!this.isDestroyed) {
        trySet(this, 'showAsCalendar', false)
      }
      Ember.$('.list-view').removeClass('hidden')
      Ember.$('.calendar-table').addClass('table-list-view')
    }
    else if (windowWidth > rezalution) {
      if (!this.isDestroyed) {
        trySet(this, 'showAsCalendar', true)
      }
      Ember.$('.list-view').addClass('hidden')
      var view = Ember.$('.calendar-view-btn .active').attr('data-toggle')
      if (view != 'list-view') {
        Ember.$('.calendar-table').removeClass('table-list-view')
      }
    }
  },

  firstDayOfTable: computed('firstDayOfCalendar', 'showAsCalendar', 'startDate', function () {
    return this.get('showAsCalendar') ? this.get('firstDayOfCalendar') : this.get('startDate')
  }),

  lastDayOfTable: computed('lastDayOfCalendar', 'showAsCalendar', 'endDate', function () {
    return this.get('showAsCalendar') ? this.get('lastDayOfCalendar') : this.get('endDate')
  }),

  monthTable: computed('firstDayOfTable', 'lastDayOfTable', function () {
    let firstDayOfTable = this.get('firstDayOfTable')
    let LastDayOfTable = this.get('lastDayOfTable')
    let days = LastDayOfTable.diff(firstDayOfTable, 'days') + 1
    let weeks = Math.ceil(days / 7)
    let monthTable = []
    let currentTableDate = moment(firstDayOfTable.format())
    for (let i = 0; i < weeks; i++) {
      monthTable[i] = {}
      for (let j = 0; (i * 7 + j < days) && (j < 7); j++) {
        monthTable[i][currentTableDate.format('YYYY-MM-DD')] = Ember.A()
        currentTableDate.add(1, 'day')
      }
    }
    return monthTable
  }),

  pbxOncallShiftsArray: computed('oncall', 'oncall.pbxOncallShifts.length', function () {
    return this.get('oncall.pbxOncallShifts') ? this.get('oncall.pbxOncallShifts') : Ember.A()
  }),

  pbxOncallShiftUsersArrays: computed('pbxOncallShiftsArray.[]', 'pbxOncallShiftsArray.@each.length', function () {
    return this.get('pbxOncallShiftsArray').map((record) => { return record.get('pbxOncallShiftUsers')})
  }),
  pbxOncallUsers: computed('pbxOncallShiftUsersArrays.@each.length', function () {
    return this.get('pbxOncallShiftUsersArrays').flatten()
  }),

  shiftsObserver: observer('oncall', 'oncall.pbxOncallShifts.length', function () {
    this.get('pbxOncallShiftsArray')
  }),

  monthTableData: computed('oncall', 'firstDayOfTable', 'lastDayOfTable',
    'pbxOncallShiftsArray.length',
    'pbxOncallShiftsArray.@each.id',
    'pbxOncallShiftsArray.@each.isDirty',
    'pbxOncallShiftsArray.@each.dayFri',
    'pbxOncallShiftsArray.@each.dayMon',
    'pbxOncallShiftsArray.@each.daySat',
    'pbxOncallShiftsArray.@each.daySun',
    'pbxOncallShiftsArray.@each.dayThu',
    'pbxOncallShiftsArray.@each.dayTue',
    'pbxOncallShiftsArray.@each.dayWed',
    'pbxOncallShiftsArray.@each.priority',
    'pbxOncallShiftsArray.@each.name',
    'pbxOncallShiftsArray.@each.startTime',
    'pbxOncallShiftsArray.@each.endTime',
    'pbxOncallShiftsArray.@each.startAt',
    'pbxOncallShiftsArray.@each.endAt',
    'pbxOncallShiftsArray.@each.metric',
    function () {
      let firstDayOfTable = this.get('firstDayOfTable')
      let LastDayOfTable = this.get('lastDayOfTable')
      let days = LastDayOfTable.diff(firstDayOfTable, 'days') + 1
      let weeks = Math.ceil(days / 7)
      let monthTable = this.get('monthTable')
      let currentTableDate = moment(firstDayOfTable.format())
      for (let i = 0; i < weeks; i++) {
        for (let j = 0; (i * 7 + j < days) && (j < 7); j++) {
          monthTable[i][currentTableDate.format('YYYY-MM-DD')].removeObjects(monthTable[i][currentTableDate.format('YYYY-MM-DD')])
          currentTableDate.add(1, 'day')
        }
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
            for (let j = 0; j < weeks; j++) {
              if (monthTable[j][key]) {
                monthTable[j][key].addObject(shift)

              }
            }
          } else {
            let startDate = moment(firstDayOfTable)
            let key = startDate.format('YYYY-MM-DD')
            for (let i = 0; i < days; i++) {
              let weekDay = startDate.format('ddd')
              if (shift.get(`day${weekDay}`)) {
                for (let j = 0; j < weeks; j++) {
                  if (monthTable[j][key]) {
                    monthTable[j][key].addObject(shift)
                    break
                  }
                }
              }
              key = startDate.add(1, 'day').format('YYYY-MM-DD')
            }
          }
        })
      }
      return monthTable
    }),

  todayShifts (currentDate, dayShifts) {
    let todayShifts = Ember.A()
    dayShifts.forEach((shift) => {
      // create new shifts with identical format {id: '', start: '', end: '', priority: '', metric: '', isRepeated: boolean, users: 'name, name2'}
      let formattedShift = {}
      formattedShift['id'] = shift.get('id')
      //If there is startAt property then it is one time shift
      if (shift.get('startAt')) {
        formattedShift['start'] = moment(shift.get('startAt'))
        formattedShift['end'] = moment(shift.get('endAt'))
        formattedShift['isRepeated'] = false
      } else {
        let start = moment(shift.get('startTime'))
        let end = moment(shift.get('endTime'))
        formattedShift['start'] = moment(moment().year(currentDate[0]).month(currentDate[1] - 1).date(currentDate[2]).hour(start.hour()).minute(start.minute()).format())
        formattedShift['end'] = moment(moment().year(currentDate[0]).month(currentDate[1] - 1).date(currentDate[2]).hour(end.hour()).minute(end.minute()).format())
        if (end.isBefore(start) || (end.hours() == 0 && end.minutes() == 0)) {
          formattedShift['end'] = formattedShift['end'].add(1, 'days')
        }
        formattedShift['isRepeated'] = true
      }
      formattedShift['priority'] = shift.get('priority')
      formattedShift['metric'] = shift.get('metric')
      if (Ember.isEmpty(this.get('userProperties'))) {
        formattedShift['users'] = ''
      } else {
        formattedShift['users'] = shift.get('pbxOncallShiftUsers').sortBy('priority').map((user) => {
          return this.get('userProperties')[user.get('pbxUserId')]
        }).join(', ')
      }
      todayShifts.addObject(formattedShift)
    })
    return todayShifts
  },

  sortedTodayShifts (dayIntervals, dayShifts, currentDate) {
    let response = []
    dayIntervals.forEach((startAtTime) => {
      if (startAtTime.date() == +currentDate[2]) {
        let currentIntervalShifts = dayShifts.filter((shift) => {
          let shiftStart = shift.start
          let shiftEnd = shift.end
          return startAtTime.isSameOrAfter(shiftStart, 'minute') && startAtTime.isBefore(shiftEnd, 'minute')
        })

        let notRepeatedShifts = currentIntervalShifts.filter((shift) => !shift.isRepeated)
        let shift = null
        // if there is no not repeated shifts then try to get repeated shifts
        if (Ember.isEmpty(notRepeatedShifts)) {
          shift = currentIntervalShifts.filter((shift) => shift.isRepeated).sortBy('priority')[0]
        } else {
          // not repeated shifts has priority over repeated. So need to sort not repeated shifts by priority
          // and that take shift with lowest priority
          shift = notRepeatedShifts.sortBy('priority')[0]
        }

        if (shift) {
          if (Ember.isEmpty(response)) {
            // if there is no shifts in response than copy shift
            response.push(Object.assign({}, shift))
            //else check that previous shift is not the same with new shift that we want to add.
            // If they are the same, then go to next iteration, otherwise set last shift end time as time of current
            // interval. Copy new shift. Set start time to current interval time and then push to response
          } else if (response[response.length - 1].id !== shift.id) {
            if (response[response.length - 1].end.isAfter(startAtTime)) {
              response[response.length - 1].end = startAtTime
            }
            let copyShift = Object.assign({}, shift)
            copyShift.start = startAtTime
            response.push(copyShift)
          }
        }
      }
    })
    return response
  },

  SortedShiftsMonthTable: computed(
    'monthTableData',
    'userProperties',
    'monthTableData.length',
    'pbxOncallUsers.@each.priority',
    'pbxOncallUsers.@each.pbxUserId',
    'pbxOncallUsers.length', function () {
      this.get('pbxOncallUsers')

      let SortedShiftsMonthTable = this.get('monthTableData').map((monthRow) => {
        let newRow = {}
        Object.keys(monthRow).forEach((key) => {
          let dayIntervals = []
          let intervals = {}
          let currentDate = key.split('-')
          let dayShifts = this.todayShifts(currentDate, monthRow[key])
          //add all start and end times to dayIntervals
          dayShifts.forEach((shift) => {
            intervals[shift.start.format('YYYY-MM-DD HH:mm')] = shift.start
            intervals[shift.end.format('YYYY-MM-DD HH:mm')] = shift.end
          })
          // find only uniq times and sort them
          let intervalStrings = Object.keys(intervals).sort()
          intervalStrings.forEach((key) => {
            dayIntervals.push(intervals[key])
          })
          //find which shift has priority on current interval
          let response = this.sortedTodayShifts(dayIntervals, dayShifts, currentDate)
          newRow[key] = Ember.A().addObject(monthRow[key])
          newRow[key].addObject(response)
        })
        return newRow
      })
      return SortedShiftsMonthTable
    }),

  fixedLastShiftsTimeMonthTable: computed('SortedShiftsMonthTable', 'SortedShiftsMonthTable.length', function () {
    this.get('SortedShiftsMonthTable').forEach((shiftsRow, rowNumber) => {
      let keys = Object.keys(shiftsRow)
      keys.forEach((key) => {
        let lastCurrent = shiftsRow[key].get('lastObject').get('lastObject')
        let firstNext
        if (shiftsRow[this.nextDay(key)]) {
          firstNext = shiftsRow[this.nextDay(key)].get('lastObject').get('firstObject')
        } else {
          let nextRow = this.get('SortedShiftsMonthTable')[rowNumber + 1]
          if (nextRow) {
            firstNext = nextRow[this.nextDay(key)].get('lastObject').get('firstObject')
          }
        }
        if (lastCurrent && firstNext) {
          let last = moment(lastCurrent.end.format('HH:mm'), 'HH:mm')
          let next = moment(firstNext.start.format('HH:mm'), 'HH:mm')
          let isNeed = lastCurrent.end.isAfter(lastCurrent.start, 'day') || (lastCurrent.end.hours() == 0 && lastCurrent.end.minutes() == 0)
          //console.log('last:', last,'next:', next,'isNeed', isNeed, 'last.isAfter', last.isAfter(next, 'minute'), lastCurrent.metric, firstNext.metric )
          if (isNeed && last.isAfter(next, 'minute')) {
            lastCurrent.end = firstNext.start
          }
        }
      })
    })
    return this.get('SortedShiftsMonthTable')
  }),

  nextDay (key) {
    return moment(key, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD')
  },

  shifts: computed('currentDate', 'monthTableData', function () {
    let monthTable = this.get('monthTableData')
    for (let i = 0; i < monthTable.get('length'); i++) {
      if (monthTable[i][this.get('currentDate')]) {
        return monthTable[i][this.get('currentDate')]
      }
    }
  }),

  hideMainContent () {
    Ember.run.schedule('afterRender', this, function () {
      $('#calendar').addClass('hidden')
      $('.header').addClass('hidden')
      $('body').addClass('gray-bg')
    })
  },

  showMainContent () {
    Ember.run.schedule('afterRender', this, function () {
      $('#calendar').removeClass('hidden')
      $('.header').removeClass('hidden')
      $('body').removeClass('gray-bg')
    })
  },

  willDestroyElement () {
    this.showMainContent()
  },

  actions: {

    setProperty (key, value) {
      this.set(key, value)
    },

    nextMonth () {
      let nextMonth = moment(this.get('currentMonth'), 'YYYY-M').add(1, 'M').format('YYYY-M')
      this.set('currentMonth', nextMonth)
    },
    previousMonth () {
      let previousMonth = moment(this.get('currentMonth'), 'YYYY-M').add(-1, 'M').format('YYYY-M')
      this.set('currentMonth', previousMonth)
    },

    listView () {
      this.set('showAsCalendar', false)
      this.$('.calendar-table').addClass('table-list-view')
      Ember.$('.list-view').removeClass('hidden')
      Ember.$('.month-view').addClass('hidden')
      this.$('button[data-toggle="list-view"]').addClass('active').siblings('.btn').removeClass('active')
    },

    calendarView () {
      this.set('showAsCalendar', true)
      this.$('.calendar-table').removeClass('table-list-view')
      Ember.$('.month-view').removeClass('hidden')
      Ember.$('.list-view').addClass('hidden')
      this.$('button[data-toggle="month-view"]').addClass('active').siblings('.btn').removeClass('active')
    },

    copyMode (shift) {
      this.toggleProperty('isCopyMode')
      this.toggleProperty('isEditDayDialog')
      this.showMainContent()
      this.get('setShiftToCopy')(shift)
      if (!this.get('showAsCalendar')) {
        this.get('notifications').info('Click dates on the calendar to copy the selected/highlighted shift to.', {
          autoClear: true,
          clearDuration: 6200
        })
      }
    },

    StopCopy () {
      this.get('setShiftToCopy')(null)
      this.toggleProperty('isCopyMode')
    },

    showEditDialog (currentDate) {
      this.set('currentDate', currentDate)
      this.toggleProperty('isEditDayDialog')
      this.hideMainContent()
    },

    closeDayDialog () {
      this.toggleProperty('isEditDayDialog')
      this.showMainContent()
    },

    showManageRepeated () {
      this.set('isEditRepeatDialog', true)
      this.hideMainContent()
    },

    closeRepeatedDialog () {
      this.toggleProperty('isEditRepeatDialog')
      this.showMainContent()
    },

    showManageDepartments () {
      this.toggleProperty('isManageDepartments')
      this.hideMainContent()
    },

    closeManageDepartmentsDialog () {
      this.toggleProperty('isManageDepartments')
      this.showMainContent()
    },
  }
})
