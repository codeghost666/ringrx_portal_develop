import { helper } from '@ember/component/helper';
import moment from 'moment'

export function messagesFaxesData([date]) {
  return moment(date).format('hh:mm A MM/DD/YYYY')
}

export default helper(messagesFaxesData);

