import { helper } from '@ember/component/helper'
import moment from 'moment'

export function audioTime ([params]) {
  let secs = Math.floor(params / 1000)
  if (secs > 0) {
    let hours = Math.floor(secs / 3600)
    let minutes = Math.floor((secs % 3600) / 60)
    let sec = secs % 60

    return moment(`${minutes}:${sec}`, 'mm:ss').format('mm:ss')

  } else {
    return moment('00:00', 'HH:mm:ss').format('mm:ss')
  }

}

export default helper(audioTime)
