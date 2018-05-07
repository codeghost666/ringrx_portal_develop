import { helper } from '@ember/component/helper';
import moment from 'moment';

export function callTime([date]) {
  return moment(date).format('hh:mm A')
}

export default helper(callTime);
