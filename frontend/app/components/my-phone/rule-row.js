import { task } from 'ember-concurrency'
import moment from 'moment'
import DraggableObject from 'ember-drag-drop/components/draggable-object'
import { computed } from '@ember/object'

export default DraggableObject.extend({
  tagName: 'tr',
  rule: {},
  isSortingRules: false,

  startTime: computed('rule.startTime', function () {
    return moment(this.get('rule.startTime')).format('hh:mm A')
  }),

  endTime: computed('rule.endTime', function () {
    return moment(this.get('rule.endTime')).format('hh:mm A')
  }),

  deleteRecord: task(function * () {
    if (!this.get('isSortingRules')) {
      yield this.get('deleteRule')(this.get('rule'))
    }
  }).drop(),

  actions: {
    editRule () {
      if (!this.get('isSortingRules')) {
        this.sendAction('manageRule', this.get('rule'))
      }
    }
  }
})
