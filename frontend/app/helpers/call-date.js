import { helper } from '@ember/component/helper'
import moment from 'moment';

export function callDate ([date]) {
  return moment(date).format('MM/DD/YYYY')
}

export default helper(callDate)
