import ApplicationAdapter from './application';
import AdapterArrayBufferMixin from 'ember-cli-file-saver/mixins/adapter-arraybuffer-mixin'

export default ApplicationAdapter.extend(AdapterArrayBufferMixin, {
  urlForUpdateRecord(id, modelName, snapshot) {
    let baseUrl = this.buildURL();
    return `${baseUrl}/mailboxes`;
  }
});
