import Ember from 'ember'
import { Serializer } from 'ember-cli-mirage'

export default Serializer.extend({
  keyForAttribute (attr) {
    return Ember.String.decamelize(attr)
  }
})
