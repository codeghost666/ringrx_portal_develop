import DS from 'ember-data'
import { fragmentArray } from 'ember-data-model-fragments/attributes'
import { collectionAction } from 'ember-api-actions';

export default DS.Model.extend({
  cnamPrefix: DS.attr(),
  distinctiveRing: DS.attr(),
  extension: DS.attr(),
  forward: DS.attr('boolean'),
  forwardDestination: DS.attr(),
  pbxAccountId: DS.attr(),
  pbxLocationId: DS.attr(),
  phonenumber: DS.attr(),
  extensionPretty: '',
  extensionPrettyFormat(key, obj){
    this.set('extensionPretty', obj[key])
    return obj[key]
  },
  pbxPhoneNumberRules: fragmentArray('pbx-phone-number-rule'),
  getLocations: collectionAction({path: 'loc', type: 'GET'}),
  getExtensions: collectionAction({path: 'ext', type: 'GET'}),
  getDistinctiveRing: collectionAction({path: 'ring', type: 'GET'})

})
