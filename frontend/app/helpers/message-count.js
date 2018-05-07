import { helper } from '@ember/component/helper';

export function messageCount([count]) {
  return `MESSAGES & FAXES(${count})`;
}

export default helper(messageCount);
