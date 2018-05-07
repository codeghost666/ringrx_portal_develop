import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  urlForCreateRecord(modelName, snapshot){
    return '/myphones/schedule/'
  },

  urlForDeleteRecord(id, modelName, snapshot) {
    return this.urlForUpdateRecord(id, modelName, snapshot)
  },

  urlForUpdateRecord (id, modelName, snapshot) {
    return `/myphones/schedule/${id}`
  }
});
