import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  pbxUserId: validator('presence', true),
  priority: validator('presence', true),
  pbxGroup: validator('belongs-to')
})
