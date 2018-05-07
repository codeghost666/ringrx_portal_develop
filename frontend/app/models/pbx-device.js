import DS from 'ember-data'
import { collectionAction } from 'ember-api-actions'
import pbxDeviceValidations from '../validations/pbxDevice'
export default DS.Model.extend(pbxDeviceValidations, {
  name: DS.attr(),
  pbxAccountId: DS.attr(),
  deviceType: DS.attr(),
  macaddress: DS.attr(),
  pbxUserId: DS.attr(),
  displayName: DS.attr(),
  signaling: DS.attr(),
  userPretty: '',
  userPrettyFormat(key, obj){
    this.set('userPretty', obj[key]);
    return obj[key]
  },
  pbxDeviceBindings: DS.hasMany('pbxDeviceBinding'),
  getDeviceTypes: collectionAction({path: 'device_types', type: 'GET'}),
  getBindingTypes: collectionAction({path: 'binding_types', type: 'GET'}),
  getBindingBehaviors: collectionAction({path: 'binding_behaviors', type: 'GET'}),
  getPbxUsers: collectionAction({path: 'pbx_users', type: 'GET'}),
  getPbxParkingLots: collectionAction({path: 'pbx_parking_lots', type: 'GET'}),
  getSignaling: collectionAction({path: 'signaling', type: 'GET'})
})
