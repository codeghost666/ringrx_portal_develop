import Component from '@ember/component'
import Ember from 'ember'
import { computed } from '@ember/object'
import { on } from '@ember/object/evented'
import moment from 'moment'
import { trySet } from '@ember/object'
import { task } from 'ember-concurrency'

export default Component.extend({
  classNames: 'tab-pane active',
  isShowingModal: false,
  myPhone: {},
  modalRule: {},
  startDate: '',
  endDate: '',
  forwardProperties: {},
  oncallProperties: {},
  isSorted: false,

  isCompletedProfile: computed('WeekGaps', function () {
    return !Object.keys(this.get('WeekGaps')).any((key) => {return this.get('WeekGaps')[key]})
  }),

  rules: computed('myPhone', function () {
    return this.get('myPhone.pbxUserSchedules')
  }),

  initDates: on('init', function () {
    this.set('startDate', moment().day(0))
    this.set('endDate', moment().day(6))
  }),

  initProperties: on('init', function () {
    this.get('myPhone').getForwardBehaviors().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'forwardProperties', response)
      }
    })
    this.get('myPhone').getOncallBehaviors().then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'oncallProperties', response)
      }
    })
    let weekTable = {
      'Sun': Ember.A(),
      'Mon': Ember.A(),
      'Tue': Ember.A(),
      'Wed': Ember.A(),
      'Thu': Ember.A(),
      'Fri': Ember.A(),
      'Sat': Ember.A(),
    }
    this.set('weekTable', weekTable)
  }),

  weekRules: computed('rules',
    'startDate',
    'EndDate',
    'forwardProperties',
    'oncallProperties',
    'rules.@each.isDirty',
    'rules.@each.dayFri',
    'rules.@each.dayMon',
    'rules.@each.daySat',
    'rules.@each.daySun',
    'rules.@each.dayThu',
    'rules.@each.dayTue',
    'rules.@each.dayWed',
    'rules.@each.priority',
    'rules.@each.name',
    'rules.@each.startTime',
    'rules.@each.endTime',
    'rules.@each.metric',
    'rules.@each.oncallBehavior',
    'rules.@each.forwardBehavior',
    function () {
      let firstDayOfWeek = this.get('startDate')
      let weekTable = this.get('weekTable')
      Object.keys(weekTable).forEach((key) => {weekTable[key].clear()})
      if (!Ember.isEmpty(this.get('rules'))) {
        this.get('rules').forEach((rule) => {
          let startDate = moment(firstDayOfWeek)
          let key = startDate.format('YYYY-MM-DD')
          for (let i = 0; i < 7; i++) {
            let weekDay = startDate.format('ddd')
            if (rule.get(`day${weekDay}`)) {

              weekTable[weekDay].addObject(rule)
            }
            startDate.add(1, 'day')
          }
        })
      }
      return weekTable
    }),

  todayRules (key, currentDay) {
    let todayRules = this.get('weekRules')[key]
    let dayRules = Ember.A()
    todayRules.forEach((rule) => {
      // create new rule with identical format {id: '', start: '', end: '', priority: '', forwardBehaviour: '', oncallBehavior: '' }
      let formattedRule = {}
      formattedRule['id'] = rule.get('id')
      formattedRule['metric'] = rule.get('metric')
      let start = moment(rule.get('startTime'))
      let end = moment(rule.get('endTime'))
      formattedRule['start'] = moment(moment().year(currentDay.year())
        .month(currentDay.month())
        .date(currentDay.date())
        .hour(start.hour())
        .minute(start.minute())
        .format())
      formattedRule['end'] = moment(moment().year(currentDay.year())
        .month(currentDay.month())
        .date(currentDay.date())
        .hour(end.hour())
        .minute(end.minute())
        .format())
      if (formattedRule['end'].isBefore(formattedRule['start']) || (end.hours() == 0 && end.minutes() == 0)) {
        formattedRule['end'] = formattedRule['end'].add(1, 'days')
      }
      formattedRule['priority'] = rule.get('priority')
      formattedRule['forwardBehavior'] = this.get('forwardProperties')[rule.get('forwardBehavior')]
      formattedRule['oncallBehavior'] = this.get('oncallProperties')[rule.get('oncallBehavior')]
      dayRules.addObject(formattedRule)
    })
    return dayRules
  },

  setNextInterval (dayRules, startAtTime, response, currentDay) {
    if (startAtTime.date() == currentDay.date()) {
      let currentIntervalRules = dayRules.filter((rule) => {
        let ruleStart = rule.start
        let ruleEnd = rule.end
        return startAtTime.isSameOrAfter(ruleStart, 'minute') && startAtTime.isBefore(ruleEnd, 'minute')
      })
      let rule = currentIntervalRules.sortBy('metric').get('firstObject')
      if (rule) {
        if (Ember.isEmpty(response)) {
          // if there is no rules in response than copy rule
          return Object.assign({}, rule)
          //else check that previous rule is not the same with new rule that we want to add.
          // If they are the same, then go to next iteration, otherwise set last rule end time as time of current
          // interval. Copy new rule. Set start time to current interval time and then push to response
        } else if (response[response.length - 1].id !== rule.id) {
          if (response[response.length - 1].end.isAfter(startAtTime)) {
            response[response.length - 1].end = startAtTime
          }
          let copyRule = Object.assign({}, rule)
          copyRule.start = startAtTime
          return copyRule
        }
      }
    }
  },

  sortedWeekRules: computed('weekRules', function () {
    let currentDay = this.get('startDate')
    let trueWeekObject = {
      'Sun': Ember.A(),
      'Mon': Ember.A(),
      'Tue': Ember.A(),
      'Wed': Ember.A(),
      'Thu': Ember.A(),
      'Fri': Ember.A(),
      'Sat': Ember.A(),
    }
    let keys = Object.keys(this.get('weekRules'))
    keys.forEach((key) => {
      let dayIntervals = []
      let intervals = {}
      let response = []
      let dayRules = this.todayRules(key, currentDay)
      //add all start and end times to dayIntervals
      dayRules.forEach((rule) => {
        intervals[rule.start.format('YYYY-MM-DD HH:mm')] = rule.start
        intervals[rule.end.format('YYYY-MM-DD HH:mm')] = rule.end
      })
      // find only uniq times and sort them
      let intervalStrings = Object.keys(intervals).sort()
      intervalStrings.forEach((key) => {
        dayIntervals.push(intervals[key])
      })
      //find which rule has priority on current interval
      dayIntervals.forEach((startAtTime) => {
        let next = this.setNextInterval(dayRules, startAtTime, response, currentDay)
        if (next) {
          response.push(next)
        }
      })
      currentDay = moment(currentDay.add(1, 'day').format())
      trueWeekObject[key] = response
      return response
    })
    return trueWeekObject
  }),

  trueWeekRules: computed('sortedWeekRules', function () {
    let trueWeekObject = this.get('sortedWeekRules')
    let keys = Object.keys(trueWeekObject)
    // if next day first rule start time is before current day last rule end day and metric of next day rule is less
    // then current day last rule metric then set current day last rule end time to next day first rule start time
    keys.forEach((key) => {
      let lastCurrent = trueWeekObject[key].get('lastObject')
      let firstNext = trueWeekObject[this.nextDay(key)].get('firstObject')
      if (lastCurrent && firstNext) {
        let last = moment(lastCurrent.end.format('HH:mm'), 'HH:mm')
        let next = moment(firstNext.start.format('HH:mm'), 'HH:mm')
        let isNeed = lastCurrent.end.isAfter(lastCurrent.start, 'day') || (lastCurrent.end.hours() == 0 && lastCurrent.end.minutes() == 0)
        if (isNeed && last.isAfter(next, 'minute')) {
          lastCurrent.end = firstNext.start
        }
      }
    })
    return trueWeekObject
  }),

  nextDay (current) {
    return {
      'Sun': 'Mon',
      'Mon': 'Tue',
      'Tue': 'Wed',
      'Wed': 'Thu',
      'Thu': 'Fri',
      'Fri': 'Sat',
      'Sat': 'Sun',
    }[current]
  },

  previousDay (current) {
    return {
      'Sun': 'Sat',
      'Mon': 'Sun',
      'Tue': 'Mon',
      'Wed': 'Tue',
      'Thu': 'Wed',
      'Fri': 'Thu',
      'Sat': 'Fri',
    }[current]
  },

  WeekGaps: computed('trueWeekRules', function () {
    let keys = Object.keys(this.get('trueWeekRules'))
    let weekGaps = {
      'Sun': false,
      'Mon': false,
      'Tue': false,
      'Wed': false,
      'Thu': false,
      'Fri': false,
      'Sat': false,
    }
    keys.forEach((key) => {
      let haveGaps = false
      let yesterdayRules = this.get('trueWeekRules')[this.previousDay(key)]
      let todayRules = this.get('trueWeekRules')[key]
      let lastYesterdayRule = yesterdayRules.get('lastObject')
      let firstTodayRule = todayRules.get('firstObject')
      // if there is no today rules or it starts not in 12:00 AM or yesterday last rule end is not the same as today
      // first rule start then there is gap today
      let isStartAtMidnight = firstTodayRule && firstTodayRule.start.hours() == 0 && firstTodayRule.start.minutes() == 0
      let isFromYesterday = firstTodayRule && lastYesterdayRule && firstTodayRule.start.isSame(lastYesterdayRule.end)
      if (!firstTodayRule || (!isStartAtMidnight && !isFromYesterday)) {
        haveGaps = true
      }
      if (!haveGaps) {
        // check if each rule end time is same as next rule start time
        haveGaps = todayRules.any((currentRule, index) => {
          let nextRule = todayRules.objectAt(index + 1)
          if (!nextRule) {
            // if there is now next rule check if it ends next day or at 12:00AM
            if (currentRule.end.isSame(currentRule.start, 'day') &&
              (currentRule.end.hours() != 0 || currentRule.end.minutes() != 0) &&
              (currentRule.end.hours() != 23 && currentRule.end.minutes() != 59)) {
              return true
            } else {
              return false
            }
          } else {
            return !currentRule.end.isSame(nextRule.start, 'minute')
          }
        })
      }
      weekGaps[key] = haveGaps
    })
    return weekGaps
  }),

  saveNewPriorities: task(function * () {
    yield this.get('saveRule')().then(() => {this.toggleProperty('isSorted')}, () => {})
  }).drop(),

  rollbackTask: task(function * () {
      yield this.get('rollbackChanges')((this.get('rules')))
    }
  ).drop(),

  actions: {
    manageRule (rule = null) {
      if (rule) {
        this.set('modalRule', rule)
      } else {
        this.set('modalRule', this.get('addNewRule')())
      }
      this.toggleProperty('isShowingModal')
    },

    closeDialog () {
      this.set('isShowingModal', false)
    },

    sortEndAction () {
      this.toggleProperty('isSorted')
      this.get('rules').forEach((rule, index) => {
        rule.set('priority', index + 1)
      })
    },

    rollback () {
      this.get('rollbackTask').perform()
    }
  }
})
