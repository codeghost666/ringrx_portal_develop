import { task } from 'ember-concurrency'
import Ember from 'ember'
import { computed, observer } from '@ember/object'
import OneTimeShiftRow from '../on-call/one-time-shift-row'

export default OneTimeShiftRow.extend({
  isTwoDays: computed('shift.startTime', 'shift.endTime', function () {
    return moment(this.get('endTime'), 'hh:mm A').isBefore(moment(this.get('startTime'), 'hh:mm A'))
  }),

  resetEdit: observer('resetEditState', function () {
    OneTimeShiftRow.prototype.resetEdit.call(this)
    this.get('shift').set('isEdited', null)
  }),

  showStartError: computed('showValidations', 'showStartValidation', 'validation.startTime.isInvalid',
    function () {
      if (this.get('showStartValidation') || this.get('showValidations')) {
        return this.get('validation.startTime.isInvalid')
      } else {
        return false
      }
    }),

  showMarkError: computed('showValidations', 'validation.dayMon.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.dayMon.isInvalid')
      } else {
        return false
      }
    }),

  startTime: computed('shift.startTime', {
    get (key) {
      return moment(this.get('shift.startTime')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length == 5) {
        let startTime = moment(this.get('shift.startTime'))
        let timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        let newStartAt = startTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format()
        this.get('shift').set('startTime', newStartAt)
        this.set('endTime', this.get('endTime'))
        return moment(newStartAt).format('hh:mm A')
      }
      return value
    }
  }),

  endTime: computed('shift.endTime', {
    get (key) {
      return moment(this.get('shift.endTime')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length >= 5) {
        let endTime = moment(this.get('shift.endTime'))
        let timeInput
        if (value.length == 5) {
          timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        } else {
          timeInput = moment(value, 'hh:mm A')
        }
        let newEndAt = moment(endTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format())
        let newEndAtString = newEndAt.format('HH:mm')
        let startTime = moment(this.get('shift.startTime'))
        let startTimeString = startTime.format('HH:mm')
        if (newEndAtString < startTimeString) {
          if (newEndAt.format('YYYY-MM-DD') == startTime.format('YYYY-MM-DD')) {
            newEndAt = moment(newEndAt.add(1, 'days').format())
          }
        } else if (newEndAt.format('YYYY-MM-DD') > startTime.format('YYYY-MM-DD')) {
          newEndAt = moment(newEndAt.subtract(1, 'days').format())
        }
        this.get('shift').set('endTime', newEndAt.format())
        return newEndAt.format('hh:mm A')
      }
      return value
    }
  }),

  willDestroyElement () {
    OneTimeShiftRow.prototype.willDestroyElement.call(this)
    this.get('shift').set('isEdited', null)
  },
  actions: {
    editShift () {
      if (!this.get('isSortMode')) {
        this.sendAction('toggleShowButton')
        this.toggleProperty('isEdited')
        this.get('shift').set('isEdited', true)
      }
    },
  }

})
