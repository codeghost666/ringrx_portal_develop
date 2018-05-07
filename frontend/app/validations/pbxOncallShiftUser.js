import { validator, buildValidations } from 'ember-cp-validations'

export default buildValidations({
  pbxUserId: validator('presence', true),
  pbxOncallShift: validator('belongs-to')
})

