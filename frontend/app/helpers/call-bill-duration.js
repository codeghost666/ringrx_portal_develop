import { helper } from '@ember/component/helper'
import moment from 'moment'

export function callBillDuration ([params]) {
  if (params > 0) {
    let hours = Math.floor(params/3600);
    let minutes = Math.floor((params % 3600) / 60);
    let sec = params % 60;

    return moment(`${hours}:${minutes}:${sec}`, 'HH:mm:ss').format('HH:mm:ss')

  } else{
    return moment('00:00:00', 'HH:mm:ss').format('HH:mm:ss')
  }
}

export default helper(callBillDuration)
