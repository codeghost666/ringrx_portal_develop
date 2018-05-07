import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  name: {
    validators: [
      validator('presence', true),
      validator('format', {
        regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
        message: 'Device Name should have minimum two characters.'
      })
    ]
  },
  deviceType: validator('presence', true),
  macaddress: {
    validators: [
      validator('presence', true),
      validator('format', {
        regex: /^([0-9A-Fa-f]{2}){6}$/,
        message: 'MAC address should be in the format 12:34:56:78:90:12.'
      })
    ]
  },
  pbxUserId: validator('presence', true),
  displayName: {
    validators: [
      validator('format', {
        regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/,
        allowBlank: true,
        message: 'Display name should have minimum two characters.'
      })
    ]
  },
  signaling: validator('presence', true),
  pbxDeviceBindings: validator('has-many')
})

/*import { validateFormat, validatePresence } from 'ember-changeset-validations/validators'

export default {
  name: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/, allowBlank: false}),
  deviceType: validatePresence(true),
  macaddress: validateFormat({
    regex: /^([0-9A-Fa-f]{2}){6}$/,
    allowBlank: false,
    message: '{description} should be in the format 12:34:56:78:90:12.'
  }),
  pbxUserId: validatePresence(true),
  displayName: validateFormat({regex: /^[a-zA-Z][a-zA-Z\s-_\d]+$/, allowBlank: true})
}*/

