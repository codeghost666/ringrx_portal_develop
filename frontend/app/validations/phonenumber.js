import {
  validateFormat,
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators'
import validateForwardDestinationPresence from '../validators/forward-destination-presence'

export default {
  forwardDestination: [
    validateFormat({type: 'phone', allowBlank: true}),
    validateForwardDestinationPresence()
  ],
  cnamPrefix: [
    validateLength({max: 255}),
    validateFormat({allowBlank: true})
  ]
}
