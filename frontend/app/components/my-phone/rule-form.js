import Component from '@ember/component'
import Ember from 'ember'
import { computed } from '@ember/object'
import { on } from '@ember/object/evented'
import moment from 'moment'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'

export default Component.extend({
  notifications: service('notification-messages'),
  validation: null,
  showValidations: false,
  ShowStartValidation: false,
  nameMask: {regex: '^[a-zA-Z][a-zA-Z\\s-_\'\\d]+$'},
  timeMask: 'h:s t',

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('rule.validations.attrs'))
  }),

  willDestroyElement () {
    try {
      this.get('rollbackChanges')(Ember.A().addObject(this.get('rule')))
    } catch (er) {
      return true
    }
  },

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

  showNameError: computed('showValidations', 'validation.name.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.name.isInvalid')
      } else {
        return false
      }
    }),
  ShowOncallBehaviorError: computed('showValidations', 'validation.oncallBehavior.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.oncallBehavior.isInvalid')
      } else {
        return false
      }
    }),

  ShowForwardBehaviorError: computed('showValidations', 'validation.forwardBehavior.isInvalid',
    function () {
      if (this.get('showValidations')) {
        return this.get('validation.forwardBehavior.isInvalid')
      } else {
        return false
      }
    }),

  startTime: computed('rule.startTime', {
    get (key) {
      return moment(this.get('rule.startTime')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length == 5) {
        let startTime = moment(this.get('rule.startTime'))
        let timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        let newStartAt = startTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format()
        this.get('rule').set('startTime', newStartAt)
        this.set('endTime', this.get('endTime'))
        return moment(newStartAt).format('hh:mm A')
      }
      return value
    }
  }),

  endTime: computed('rule.endTime', {
    get (key) {
      return moment(this.get('rule.endTime')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length >= 5) {
        let endTime = moment(this.get('rule.endTime'))
        let timeInput
        if (value.length == 5) {
          timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        } else {
          timeInput = moment(value, 'hh:mm A')
        }
        let newEndAt = moment(endTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format())
        let newEndAtString = newEndAt.format('HH:mm')
        let startTime = moment(this.get('rule.startTime'))
        let startTimeString = startTime.format('HH:mm')
        if (newEndAtString < startTimeString) {
          if (newEndAt.format('YYYY-MM-DD') == startTime.format('YYYY-MM-DD')) {
            newEndAt = moment(newEndAt.add(1, 'days').format())
          }
        } else if (newEndAt.format('YYYY-MM-DD') > startTime.format('YYYY-MM-DD')) {
          newEndAt = moment(newEndAt.subtract(1, 'days').format())
        }
        this.get('rule').set('endTime', newEndAt.format())
        return newEndAt.format('hh:mm A')
      }
      return value
    }
  }),

  saveChanges: task(function * () {
    this.set('showValidations', true)
    let rule = this.get('rule')
    if (rule.get('validations.isValid')) {
      yield this.get('saveRule')().then(() => {this.sendAction('closeDialog')}, () => {})
    } else {
      this.get('notifications').error('Change a few things up and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

  actions: {
    setProperty (key, value) {
      this.get('rule').set(key, value)
      return value
    },

    rollback () {
      this.sendAction('closeDialog')
    },
  }

})
