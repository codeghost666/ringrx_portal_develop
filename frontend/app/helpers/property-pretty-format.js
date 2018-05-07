import { helper } from '@ember/component/helper';

export function propertyPrettyFormat([params, length]) {
  if (params && params.length > length) {
    return `${params.slice(0, length + 1)}...`
  } else {
    return params
  }
}

export default helper(propertyPrettyFormat);
