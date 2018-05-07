import { helper } from '@ember/component/helper';
import DS from 'ember-data'

export function quotaPercentage([quota, quotaUse]) {
  if (quota) {
    return (quotaUse / quota *100).toFixed(2)
  } else {
    return 0
  }
}

export default helper(quotaPercentage);
