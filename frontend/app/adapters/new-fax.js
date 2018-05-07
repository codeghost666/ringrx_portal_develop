import ApplicationAdapter from './application';
import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

export default ApplicationAdapter.extend(FormDataAdapterMixin, {

  urlForCreateRecord (modelName, snapshot) {
    let baseUrl = this.buildURL()
    return `${baseUrl}/voicemails/fax`
  }
});
