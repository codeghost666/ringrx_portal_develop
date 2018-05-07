import ShiftRow from '../on-call/shift-row'
import { computed } from '@ember/object'

export default ShiftRow.extend({
  setClassName: computed('toggleValue', function () {
    let elemClass = 'coll-row'
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
});
