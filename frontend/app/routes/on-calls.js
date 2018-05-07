import Route from '@ember/routing/route'
import moment from 'moment'
import { inject as service } from '@ember/service'
import { task } from 'ember-concurrency'
import Ember from 'ember'

export default Route.extend({
  notifications: service('notification-messages'),
  shiftCount: null,
  shiftToCopy: null,
  shiftsToDelete: Ember.A(),
  usersToDelete: Ember.A(),
  model () {
    return this.get('store').findAll('pbxOnCall')
  },

  setupController (controller, model) {
    // Call _super for default behavior
    this._super(controller, model)
    // Implement your custom setup after
    this.controllerFor('onCalls').set('oncallId', model.get('firstObject.id'))
    this.initializeCounts(model)
  },

  initializeCounts (model) {
    let oncall = model.findBy('id', this.controller.get('oncallId'))
    let count = 0
    if (!Ember.isEmpty(oncall) && !Ember.isEmpty(oncall.get('pbxOncallShifts'))) {
      let singlePriorities = oncall.get('pbxOncallShifts').mapBy('priority')
      count = Math.max(...singlePriorities)
    }
    this.set('shiftCount', count)
  },

  addShift (shifts, startTime, startAt) {
    let priority = this.get('shiftCount') + 1
    this.set('shiftCount', priority)
    const newShift = this.get('store').createRecord('pbxOncallShift', {
      priority: priority,
      startTime: startTime,
      endTime: startTime,
      startAt: startAt,
      endAt: startAt,
      name: `Shift number ${priority}`,
      pbxOncallId: this.controller.get('oncallId'),
      pbxOncall: this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
    })
    const shiftUser = this.get('store').createRecord('pbxOncallShiftUser', {priority: 1})
    newShift.get('pbxOncallShiftUsers').addObject(shiftUser)
    let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
    oncall.get('pbxOncallShifts').addObject(newShift)
  },

  getProperty (path) {
    let adapter = this.store.adapterFor('application')
    let baseUrl = adapter.buildURL('pbxOnCall') + path
    return adapter.ajax(baseUrl, 'GET')
  },

  actions: {
    addOneTimeShift (shifts, currentDate) {
      if (this.controller.get('oncallId')){
        const startAt = moment(currentDate, 'YYYY-MM-DD').format()
        this.addShift(shifts, null, startAt)
        return true
      } else {
        return false
      }
    },

    addRepeatedShift (shifts) {
      if (this.controller.get('oncallId')) {
        const startTime = moment('2000-01-01', 'YYYY-MM-DD').format()
        this.addShift(shifts, startTime, null)
        return true
      } else {
        return false
      }
    },

    addUserToShift (shift) {
      let priorities = shift.get('pbxOncallShiftUsers').mapBy('priority')
      const priority = Math.max(...priorities) + 1
      const user = this.get('store').createRecord('pbxOncallShiftUser', {
        priority: priority,
        pbxOncallShiftId: shift.get('id')
      })
      shift.get('pbxOncallShiftUsers').addObject(user)
    },

    deleteUserFromShift (shift, user) {
      this.get('usersToDelete').addObject(user)
      shift.get('pbxOncallShiftUsers').removeObject(user)
      if (!user.get('id')) {
        shift.get('pbxOncallShiftUsers').filterBy('id', null).forEach((shiftUser) => {
          let priority = shiftUser.get('priority')
          if (priority > user.get('priority')) {
            shiftUser.set('priority', priority - 1)
          }
        })
      }
    },

    deleteRecord (shifts, shiftToDelete) {
      this.get('shiftsToDelete').addObject(shiftToDelete)
      let priority = this.get('shiftCount') - 1
      this.set('shiftCount', priority)
      shifts.removeObject(shiftToDelete)
    },

    rollbackChanges (shifts) {
      Ember.run.schedule('afterRender', this, function () {
        // delete blank users
        this.get('usersToDelete').filterBy('id', null).invoke('deleteRecord')
        // push not blank users back to shifts
        this.get('usersToDelete').filterBy('id').forEach((user) => {
          let shift = this.get('store').peekRecord('pbxOncallShift', user.get('pbxOncallShiftId'))
          user.rollbackAttributes()
          shift.get('pbxOncallShiftUsers').addObject(user)
        })
        this.set('usersToDelete', Ember.A())
        // delete blank shift users
        this.get('shiftsToDelete').filterBy('id', null).forEach((shift) => {
          shift.get('pbxOncallShiftUsers').filterBy('id', null).invoke('deleteRecord')
        })
        // delete blank shifts
        this.get('shiftsToDelete').filterBy('id', null).invoke('deleteRecord')
        // push not blank shifts back to oncall
        this.get('shiftsToDelete').filterBy('id').forEach((shift) => {
          shift.get('pbxOncallShiftUsers').filterBy('id', null).invoke('deleteRecord')
          shift.rollbackAttributes()
          shift.get('pbxOncallShiftUsers').filterBy('id').invoke('rollbackAttributes')
          shifts.addObject(shift)
        })
        this.set('shiftsToDelete', Ember.A())
        //shifts.filterBy('id').invoke('rollback')
        shifts.forEach((shift) => {
          shift.get('pbxOncallShiftUsers').filterBy('id', null).invoke('deleteRecord')
          shift.get('pbxOncallShiftUsers').filterBy('id').invoke('rollbackAttributes')
        })
        shifts.filterBy('id', null).invoke('deleteRecord')
        shifts.removeObjects(shifts.filterBy('id', null))
        if (this.controller.get('oncallId')){
          let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
          oncall.get('pbxOncallShifts').invoke('rollbackAttributes')
        }
        this.initializeCounts(this.controller.get('model'))
      })
    },

    saveShifts (shifts) {
      // delete users
      this.get('usersToDelete').filterBy('id', null).invoke('deleteRecord')
      return Promise.all(this.get('usersToDelete').filterBy('id').map(function (user) {
        user.deleteRecord()
        return user.save()
      })).then(() => {
        this.set('usersToDelete', Ember.A())
        return true
      }).then(() => {
        // delete shifts
        this.get('shiftsToDelete').filterBy('id', null).invoke('deleteRecord')
        return Promise.all(this.get('shiftsToDelete').filterBy('id').map(function (shift) {
          shift.deleteRecord()
          return shift.save()
        }))
      }).then(() => {
        this.get('shiftsToDelete').filterBy('id').forEach(function (shift) {
          shift.get('pbxOncallShiftUsers').invoke('deleteRecord')
        })
        this.set('shiftsToDelete', Ember.A())
        return true
      }).then(() => {
        // save changes to shifts
        let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
        return oncall.save()
      }).then(() => {
        this.get('store').peekAll('pbxOncallShift').filterBy('id', null).invoke('deleteRecord')
        this.get('store').peekAll('pbxOncallShiftUser').filterBy('id', null).invoke('deleteRecord')

        this.initializeCounts(this.controller.get('model'))
        this.get('notifications').success('Changes have saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not save changes. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    moveShiftOnTop (shiftToTop) {
      let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
      let sortedObjects = oncall.get('pbxOncallShifts').sortBy('priority').removeObjects(shiftToTop)
      sortedObjects.unshiftObjects(shiftToTop)
      sortedObjects.forEach((shift, index) => {
        shift.set('priority', index + 1)
      })
    },

    // manage department methods

    getNewOncall () {
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL('pbxOnCall')
      let fullUrl = `${baseUrl}/new`
      let request = adapter.ajax(fullUrl, 'GET')
      return request.then((response) => {
        let properties = {}
        Object.keys(response).forEach((key) => {
          let newKey = Ember.String.camelize(key)
          properties[newKey] = response[key]
        })
        let newOncall = this.store.createRecord('pbxOnCall', properties)
        return true
      })
    },

    saveOncall (oncall) {
      return oncall.save().then(() => {
        this.get('store').peekAll('pbxOnCall').forEach((user) => {
          user.send('pushedData')
        })
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not save department. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    deleteOncall (oncall) {
      oncall.deleteRecord()
      return oncall.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete department. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    rollbackDepartmentChanges () {
      let model = this.controller.get('model')
      model.filterBy('id', null).invoke('deleteRecord')
      model.filterBy('id').invoke('rollbackAttributes')
    },

    moveUserOnTop (id, users) {
      users.forEach((user, index) => {
        user.set('priority', index + 1)
      })
    },

    updatePriority () {
      let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
      return oncall.save().then(() => {
        this.get('store').peekAll('pbxOncallShift').forEach((shift) => {
          shift.send('pushedData')
        })
        this.get('store').peekAll('pbxOncallShiftUser').forEach((user) => {
          user.send('pushedData')
        })
        this.get('notifications').success('Changes have saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not save changes. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    setShiftToCopy (shift) {
      this.set('shiftToCopy', shift)
    },

    copyShift (day) {
      let dayArr = day.split('-')
      let priority = this.get('shiftCount') + 1
      this.set('shiftCount', priority)
      let shiftToCopy = this.get('shiftToCopy')
      let start = moment(shiftToCopy.get('startAt'))
      let end = moment(shiftToCopy.get('endAt'))
      let startAt = start.year(+dayArr[0]).month(dayArr[1] - 1).date(+dayArr[2]).format()
      let endAt = end.year(+dayArr[0]).month(dayArr[1] - 1).date(+dayArr[2]).format()
      if (moment(shiftToCopy.get('startAt')).date() != moment(shiftToCopy.get('endAt')).date()) {
        endAt = moment(endAt).add(1, 'days').format()
      }
      const newShift = this.get('store').createRecord('pbxOncallShift', {
        priority: priority,
        startTime: null,
        endTime: null,
        startAt: startAt,
        endAt: endAt,
        name: `Shift number ${priority}`,
        pbxOncallId: this.controller.get('oncallId'),
        pbxOncall: this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
      })
      shiftToCopy.get('pbxOncallShiftUsers').forEach((user) => {
        const newUser = this.get('store').createRecord('pbxOncallShiftUser', {
          priority: user.get('priority'),
          pbxUserId: user.get('pbxUserId'),
          pbxOncallShift: newShift
        })
        newShift.get('pbxOncallShiftUsers').addObject(newUser)
      })
      return newShift.save().then(() => {
        let oncall = this.get('store').peekRecord('pbxOnCall', this.controller.get('oncallId'))
        newShift.get('pbxOncallShiftUsers').filterBy('id', null).invoke('deleteRecord')
        oncall.get('pbxOncallShifts').addObject(newShift)
        this.get('notifications').success('Shift has copied successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not copy shift. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    getMoh () {
      return this.getProperty('/moh')
    },

    getMediafiles () {
      return this.getProperty('/mediafiles')
    },

    getMailboxes () {
      return this.getProperty('/mailboxes')
    },

    getPhonenumbers () {
      return this.getProperty('/phonenumbers')
    },
  }
})
