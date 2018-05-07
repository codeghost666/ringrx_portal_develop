import ApplicationAdapter from './application';
import FormDataAdapterMixin from 'ember-cli-form-data/mixins/form-data-adapter';

export default ApplicationAdapter.extend(FormDataAdapterMixin, {
  urlForUpdateRecord (id, modelName, snapshot) {
    return this.urlForCreateRecord(modelName, snapshot)
  }
});
