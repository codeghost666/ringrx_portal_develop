import Component from '@ember/component';
import { computed} from '@ember/object'

export default Component.extend({
  tagName: 'tr',

  iconClass: computed('message.messageType', function () {
    switch (this.get('message.messageType')) {
      case 'voicemail':
        return 'icon-play'
      case 'oncall':
        return 'icon-play'
      case 'fax':
        return 'icon-page-1'
      case 'message':
        return 'icon-mail'
    }
  }),

  didInsertElement () {
    this.$('.td-collapse').hide()
  },

  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
});
