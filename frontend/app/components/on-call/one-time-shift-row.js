import { task } from 'ember-concurrency'
import Ember from 'ember'
import { computed, observer } from '@ember/object'
import moment from 'moment'
import { on } from '@ember/object/evented'
import DraggableObject from 'ember-drag-drop/components/draggable-object'
import { inject as service } from '@ember/service'

export default DraggableObject.extend({
  dragCoordinator: service(),
  tagName: 'tr',
  shift: {},
  userProperties: {},
  isEdited: false,
  newShiftUsersList: Ember.A(),
  timeMask: 'h:s t',
  validation: null,
  showValidations: false,
  showStartValidation: false,
  showEndValidation: false,
  showActions: true,
  isTwoDays: computed('shift.startAt', 'shift.endAt', function () {
    return moment(this.get('shift.endAt')).isAfter(this.get('shift.startAt'), 'day')
  }),

  resetEdit: observer('resetEditState', function () {
    this.set('isEdited', false)
  }),

  overrideClass: computed('isEdited', 'isSortable', function () {
    if (this.get('isEdited')) {
      return 'edit-shift'
    } else if (this.get('isSortable')) {
      return 'sortable-objects'
    } else {
      return ''
    }
  }),

  initProperties: on('init', function () {
    Ember.defineProperty(this, 'validation', computed.readOnly('shift.validations.attrs'))
  }),

  showStartError: computed('showValidations', 'showStartValidation', 'validation.startAt.isInvalid',
    function () {
      if (this.get('showStartValidation') || this.get('showValidations')) {
        return this.get('validation.startAt.isInvalid')
      } else {
        return false
      }
    }),

  deleteShift: task(function * () {
      if (!this.get('isSortMode')) {
        yield this.get('deleteShiftRecord').perform(this.get('shift'))
      }
    }
  ).drop(),

  startTime: computed('shift.startAt', {
    get (key) {
      return moment(this.get('shift.startAt')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length == 5) {
        let startTime = moment(this.get('shift.startAt'))
        let timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        let newStartAt = startTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format()
        this.get('shift').set('startAt', newStartAt)
        this.set('endTime', this.get('endTime'))
        return moment(newStartAt).format('hh:mm A')
      }
      return value
    }
  }),

  endTime: computed('shift.endAt', {
    get (key) {
      return moment(this.get('shift.endAt')).format('hh:mm A')
    },
    set (key, value) {
      if (value.length >= 5) {
        let endTime = moment(this.get('shift.endAt'))
        let timeInput
        if (value.length == 5) {
          timeInput = moment(`${value.slice(0, 2)}:${value.slice(2, 4)} ${value.charAt(4)}m`, 'h:m a')
        } else {
          timeInput = moment(value, 'hh:mm A')
        }
        let newEndAt = moment(endTime.hours(timeInput.hours()).minutes(timeInput.minutes()).format())
        let newEndAtString = newEndAt.format('HH:mm')
        let startAt = moment(this.get('shift.startAt'))
        let startAtString = startAt.format('HH:mm')
        if (newEndAtString < startAtString) {
          if (newEndAt.format('YYYY-MM-DD') == startAt.format('YYYY-MM-DD')) {
            newEndAt = moment(newEndAt.add(1, 'days').format())
          }
        } else if (newEndAt.format('YYYY-MM-DD') > startAt.format('YYYY-MM-DD')) {
          newEndAt = moment(newEndAt.subtract(1, 'days').format())
        }
        this.get('shift').set('endAt', newEndAt.format())
        return moment(newEndAt).format('hh:mm A')
      }
      return value
    }
  }),

  addUser: task(function * () {
    yield this.get('addUserToShift')(this.shift)
  }),

  deleteUser: task(function * (user) {
    yield this.get('deleteUserFromShift')(this.shift, user)
  }),

  //array of users in their priority
  sortedUsers: computed('shift.pbxOncallShiftUsers', 'userProperties', 'shift.pbxOncallShiftUsers.@each.priority',
    function () {
      if (Ember.isEmpty(this.get('userProperties'))) {
        return ''
      } else {
        return this.get('shift.pbxOncallShiftUsers').sortBy('priority').map((user, index) => {
          return {name: this.get('userProperties')[user.get('pbxUserId')], index: index + 1}
        })
      }
    }),

  //users not in shift
  userPropertiesList: computed('userProperties', 'shift.pbxOncallShiftUsers.length',
    'shift.pbxOncallShiftUsers.@each.pbxUserId', function () {
      let keys = Object.keys(this.get('userProperties'))
      let result = Ember.A()
      //this.get('shiftUsers').forEach((shift) => result.addObject(shift))
      let usedKeys = this.get('shift').get('pbxOncallShiftUsers').map((user) => {
        return +user.get('pbxUserId')
      })
      keys.forEach((key) => {
        if (!usedKeys.includes(+key)) {
          result.addObject({
            key: +key,
            value: this.get('userProperties')[key]
          })
        }
      })
      return result
    }),

  //users from shift
  shiftUsers: computed('isEdited', 'shift.pbxOncallShiftUsers.[]', 'shift.pbxOncallShiftUsers.length',
    'shift.pbxOncallShiftUsers.@each.priority', function () {
      if (this.get('isEdited')) {
        return this.get('shift.pbxOncallShiftUsers').sortBy('priority')
      } else {
        return Ember.A()
      }
    }),

  actions: {
    editShift () {
      if (!this.get('isSortMode')) {
        this.sendAction('toggleShowButton')
        this.toggleProperty('isEdited')
      }
    },

    setProperty (key, user, value) {
      user.set(key, value)
    },

    runCopyMode () {
      this.sendAction('copyMode', this.get('shift'))
    },

    usersSortEndAction () {
      this.get('moveUserOnTop')(this.get('shift.id'), this.get('shiftUsers'))
    },
  }

})
