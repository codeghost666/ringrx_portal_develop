import Component from '@ember/component'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'
import Ember from 'ember'
import config from '../../config/environment'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  paginateBy: 10,
  usersProperties: {},
  didRender () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },
  didDestroyElement () {
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  initProperties: on('init', function () {
    this.get('getPropertie')('/pbxdevices/pbx_users').then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'usersProperties', response)
      }
    })
  }),

  actions: {
    setProperty(propertie, value) {
      this.set(propertie, value);
      return value
    },
  }
})
