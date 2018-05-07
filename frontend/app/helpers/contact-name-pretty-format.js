import { helper } from '@ember/component/helper'

export function contactNamePrettyFormat ([name]) {
  let namePretty = name.split(';').join(' ')
  if (namePretty.length > 25) {
    return `${namePretty.slice(0, 26)}...`
  } else {
    return namePretty
  }
}

export default helper(contactNamePrettyFormat)
