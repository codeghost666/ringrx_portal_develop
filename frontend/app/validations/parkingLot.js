import { validateFormat, validatePresence, validateNumber } from 'ember-changeset-validations/validators'
import DS from 'ember-data'

export default {
  pbxAccountId: validatePresence(true),
  extension: validatePresence(true),
  moh: validatePresence(true),
  timeoutExtension: validatePresence(true),
  timeout: [
    validatePresence(true),
    validateNumber({integer: true, gte: 0, lte: 3600})
  ],
}
