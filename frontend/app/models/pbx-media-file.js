import DS from 'ember-data'
import { memberAction } from 'ember-api-actions'

export default DS.Model.extend({
  pbxAccountId: DS.attr(),
  uuid: DS.attr(),
  name: DS.attr(),
  filename: DS.attr(),
  mediafile: DS.attr('file'),
  mimeType: DS.attr(),
  fileType: DS.attr(),
  currentSound: null,
  download: memberAction({path: 'media', type: 'GET', ajaxOptions: {blob: true}})
})
