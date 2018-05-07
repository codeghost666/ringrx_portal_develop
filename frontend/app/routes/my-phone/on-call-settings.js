import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'

export default Route.extend({
  notifications: service('notification-messages'),
  ruleHighestPriority: null,

  model () {
    return this.modelFor('my-phone')
  },

  setupController (controller, model) {
    // Call _super for default behavior
    this._super(controller, model)
    // Implement your custom setup after
    this.initializeHighestPriority(model)
  },

  initializeHighestPriority (model) {
    let rules = model.get('firstObject')
    let count = 0
    if (!Ember.isEmpty(rules.get('pbxUserSchedules'))) {
      let singlePriorities = rules.get('pbxUserSchedules').mapBy('priority')
      count = Math.max(...singlePriorities)
    }
    this.set('ruleHighestPriority', count)
  },

  actions: {
    addNewRule () {
      let priority = this.get('ruleHighestPriority') + 1
      this.set('ruleHighestPriority', priority)
      const startTime = moment('2000-01-01', 'YYYY-MM-DD').format()
      let myphone = this.controllerFor('my-phone.on-call-settings').get('model.firstObject')
      let newRule = this.get('store').createRecord('pbxUserSchedule', {
        startTime: startTime,
        endTime: startTime,
        pbxUserId: myphone.get('id'),
        priority: priority,
      })
      myphone.get('pbxUserSchedules').addObject(newRule)
      return newRule
    },

    deleteRule (rule) {
      rule.deleteRecord()
      return rule.save().then(() => {
        this.get('notifications').success('Deleted successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not delete rule. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    saveRule () {
      let myphone = this.controllerFor('my-phone.on-call-settings').get('model.firstObject')
      return myphone.save().then(() => {
        this.get('store').peekAll('pbxUserSchedule').filterBy('id', null).invoke('deleteRecord')
        this.get('store').peekAll('pbxUserSchedule').filterBy('id').forEach((shift) => {
          shift.send('pushedData')
        })
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, (e) => {
        this.get('notifications').error('Can not update rule. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
        return Promise.reject(e)
      })
    },

    willTransition () {
      let myphone = this.controllerFor('my-phone.on-call-settings').get('model.firstObject')
      myphone.get('pbxUserSchedules').filterBy('id', null).invoke('deleteRecord')
      this.get('store').peekAll('pbxUserSchedule').invoke('rollbackAttributes')
    },

    rollbackChanges (rules) {
      Ember.run.schedule('afterRender', this, function () {
        let myphone = this.controllerFor('my-phone.on-call-settings').get('model.firstObject')
        myphone.get('pbxUserSchedules').filterBy('id', null).invoke('deleteRecord')
        rules.filterBy('id').filterBy('hasDirtyAttributes').invoke('rollbackAttributes')
        this.initializeHighestPriority(this.controllerFor('my-phone.on-call-settings').get('model'))
      })
    }
  }
})
