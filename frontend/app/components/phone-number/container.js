import Component from '@ember/component'
import { on } from '@ember/object/evented'
import { trySet } from '@ember/object'
import Ember from "ember"
import config from '../../config/environment'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  paginateBy: 10,
  distinctiveRingProperties: {},
  PbxLocationProperties: {},
  extensionProperties: {},
  didRender(){
    $.fn.matchHeight._maintainScroll = true;
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
  },
  didDestroyElement(){
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    });
  },
  initProperties: on('init', function () {
    this.get('getPropertie')('/phonenumbers/ext').then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'extensionProperties', response)
      }
    })
    this.get('getPropertie')('/phonenumbers/ring').then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'distinctiveRingProperties', response)
      }
    })
    this.get('getPropertie')('/phonenumbers/loc').then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'PbxLocationProperties', response)
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
