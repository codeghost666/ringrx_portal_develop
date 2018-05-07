import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
  urlForDeleteRecord(id, modelName, snapshot) {
    let groupId = snapshot.attr('pbxGroupId')
    let baseUrl = this.buildURL();
    return `${baseUrl}/pbxgroups/${groupId}/user/${id}`
    }
});
