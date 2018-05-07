import { helper } from '@ember/component/helper'

export function callHangupCause ([params]) {
  return params.toLowerCase().split('_').join(' ').capitalize()
}

export default helper(callHangupCause)
