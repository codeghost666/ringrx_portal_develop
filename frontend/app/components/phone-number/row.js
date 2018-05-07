import Component from '@ember/component'
import { computed } from '@ember/object'

export default Component.extend({
  tagName: 'tr',
  distinctiveRingProperties: {},
  PbxLocationProperties: {},
  extensionProperties: {},

  extensionFormatted: computed('phone.extension', 'extensionProperties', function () {
    return this.phone.extensionPrettyFormat(this.get('phone').get('extension'), this.extensionProperties)
  }),

  didRender () {
    this.$('.td-collapse').hide()
  },
  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
