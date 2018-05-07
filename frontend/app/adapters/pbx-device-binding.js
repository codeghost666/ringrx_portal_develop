import ApplicationAdapter from './application'

export default ApplicationAdapter.extend({
  urlForDeleteRecord (id, modelName, snapshot) {
    let deviceId = snapshot.attr('pbxDeviceId')
    let baseUrl = this.buildURL()
    return `${baseUrl}/pbxdevices/${deviceId}/binding/${id}`
  }
})
