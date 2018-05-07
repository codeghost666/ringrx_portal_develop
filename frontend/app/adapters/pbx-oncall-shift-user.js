import ApplicationAdapter from './application';
import {inject as service} from '@ember/service'

export default ApplicationAdapter.extend({
  store: service(),
  urlForDeleteRecord(id, modelName, snapshot) {
    // '/pbxoncalls/:pbx_oncall_id/shifts/:id'
    const oncallId = this.get('store').peekRecord('pbxOncallShift', snapshot.attr('pbxOncallShiftId')).get('pbxOncallId')
    return `/pbxoncalls/${oncallId}/shifts/${snapshot.attr('pbxOncallShiftId')}/${id}`
  },
});
