import { helper } from '@ember/component/helper';
import moment from 'moment'

export function currentMonth([currentMoth]) {
  return moment(currentMoth, 'YYYY-M').format('MMMM, YYYY')
}

export default helper(currentMonth);
