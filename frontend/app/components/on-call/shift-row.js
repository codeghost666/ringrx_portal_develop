import Component from '@ember/component'
import { computed } from '@ember/object'
import moment from 'moment'
import { trySet } from '@ember/object'

export default Component.extend({
  shift: {},
  classNameBindings: ['setClassName'],
  index: 0,
  intervalId: null,
  toggleValue: 0,

  setClassName: computed('toggleValue', function () {
    let elemClass = !this.get('index') ? 'event first' : 'event'
    if (moment().isBefore(moment(this.get('cellDay'), 'YYYY-MM-DD'))) {
      elemClass += ' next'
    } else {
      let start = moment(this.get('shift').start, 'hh:mm A')
      let end = moment(this.get('shift').end, 'hh:mm A')
      if (moment().isBetween(start, end)) {
        elemClass += ' now'
      } else if (moment().isBefore(start)) {
        elemClass += ' next'
      }
    }
    return elemClass
  }),

  didInsertElement () {
    let intervalId = setInterval(() => {
      this.set('toggleValue', this.get('toggleValue') + 1)
    }, 60000)
    this.set('intervalId', intervalId)
  },

  didDestroyElement () {
    if (this.get('intervalId')) {
      clearInterval(this.get('intervalId'))
    }
  }
})
