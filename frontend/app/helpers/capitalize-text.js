import { helper } from '@ember/component/helper';

export function capitalizeText([params]) {
  return params.capitalize()
}

export default helper(capitalizeText);
