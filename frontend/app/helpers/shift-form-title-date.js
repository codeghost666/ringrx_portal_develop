import { helper } from '@ember/component/helper';
import moment from 'moment'

export function shiftFormTitleDate([date]) {
  return moment(date, 'YYYY-MM-DD').format('MMMM DD, YYYY - dddd');
}

export default helper(shiftFormTitleDate);
