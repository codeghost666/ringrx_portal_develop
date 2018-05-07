import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  urlForCreateRecord(modelName, snapshot){
    return `/pbxoncalls/${snapshot.attr('pbxOncallId')}/shifts`
  },

  urlForDeleteRecord(id, modelName, snapshot) {
    // '/pbxoncalls/:pbx_oncall_id/shifts/:id'
    return `/pbxoncalls/${snapshot.attr('pbxOncallId')}/shifts/${id}`
  },

  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  }
});
