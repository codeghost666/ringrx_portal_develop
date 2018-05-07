import { validateFormat, validatePresence } from 'ember-changeset-validations/validators'

export default {
  pbxAccountId: validatePresence(true),
  name: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_']+$/, allowBlank: false}),
  address: validateFormat({regex: /^[a-zA-Z\s-_\d.]+$/, allowBlank: false}),
  city: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_']+$/, allowBlank: false}),
  state: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_']+$/, allowBlank: false}),
  zip: validateFormat({
    regex: /^\d{5}-\d{4}|^\d{5}$/,
    allowBlank: false,
    message: '{description} should be in the form 12345 or 12345-1234'
  })
}
