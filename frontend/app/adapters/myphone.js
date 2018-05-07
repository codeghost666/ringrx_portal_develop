import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForUpdateRecord(id, modelName, snapshot) {
        let baseUrl = this.buildURL();
        return `${baseUrl}/myphones`;
    },

  shouldReloadAll(store, snapshotArray){
    return true
  }
});
