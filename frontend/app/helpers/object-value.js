import { helper } from '@ember/component/helper';

export function objectValue([key, obj]) {
  return obj[key];
}

export default helper(objectValue);
