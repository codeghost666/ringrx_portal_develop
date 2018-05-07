import ApplicationAdapter from './application';

export default ApplicationAdapter.extend( {
  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  }
});
