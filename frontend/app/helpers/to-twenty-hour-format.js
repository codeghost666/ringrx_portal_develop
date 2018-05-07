import { helper } from '@ember/component/helper';


export function toTwentyHourFormat([time]) {
  return time.format('hh:mm A');
}

export default helper(toTwentyHourFormat);
