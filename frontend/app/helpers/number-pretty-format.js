import { helper } from '@ember/component/helper'

export function numberPrettyFormat ([params]) {
  if (params) {
    return `(${params.slice(0, 3)})-${params.slice(3, 6)}-${params.slice(6)}`
  }
  return params
}

export default helper(numberPrettyFormat)
