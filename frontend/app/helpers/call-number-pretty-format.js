import { helper } from '@ember/component/helper'

export function callNumberPrettyFormat ([params]) {
  if (params && params.match(/\+?\d{10}/)) {
    if (params.startsWith("+"))
    {
      params = params.substring(1)
    }
    if (params.startsWith("1"))
    {
      params = params.substring(1)
    }
    return `${params.slice(0, 3)}-${params.slice(3, 6)}-${params.slice(6)}`
  }
  return params
}

export default helper(callNumberPrettyFormat)
