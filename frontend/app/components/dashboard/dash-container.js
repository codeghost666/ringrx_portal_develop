import Component from '@ember/component';
import { computed, observer } from '@ember/object'
import moment from 'moment'

export default Component.extend({
  messages: computed('model.voicemail', function(){
    return this.get('model.voicemail').filter((item) => {
      return moment(item.get('createdAt')).isSame(moment(), 'day')
    })
  })
});
