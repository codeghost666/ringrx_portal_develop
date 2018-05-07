import { helper } from '@ember/component/helper';

export function quotaFormat([quota]) {
  if (quota){
    let megaB = Math.floor(quota/(1024*1024));

    return megaB + ' MB'
  }
  return quota + ' MB';
}

export default helper(quotaFormat);
