import { helper } from '@ember/component/helper';

export function deviceMacaddress([params]) {
  if (params){
    return params.toUpperCase().match(/.{2}/g).join(':')
  }
}

export default helper(deviceMacaddress);
