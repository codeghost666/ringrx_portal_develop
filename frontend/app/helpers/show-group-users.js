import { helper } from '@ember/component/helper'

export function showGroupUsers ([users, userProperties]) {
  let usersNames = []
  users.forEach((user) => {
    if (userProperties[user.get('pbxUserId')]) {usersNames.push(userProperties[user.get('pbxUserId')])}
  })
  return usersNames.join(', ')
}

export default helper(showGroupUsers)
