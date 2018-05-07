import Component from '@ember/component'
import { task } from 'ember-concurrency'
import {computed} from '@ember/object'

export default Component.extend({
  tagName: 'tr',
  usersProperties: {},

  didRender () {
    this.$('.td-collapse').hide()
  },
  deleteDevice: task(function * () {
      yield this.get('deleteRecord')(this.get('device'))
    }
  ).drop(),

  userFormatted: computed('device.pbxUserId', 'usersProperties', function () {
    return this.device.userPrettyFormat(this.get('device').get('pbxUserId'), this.usersProperties)
  }),
  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
