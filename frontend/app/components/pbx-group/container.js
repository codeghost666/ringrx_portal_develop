import Component from '@ember/component';
import Ember from "ember"
import { on } from '@ember/object/evented'
import { trySet} from '@ember/object'
import config from '../../config/environment'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  paginateBy: 10,
  pbxUserProperties: {},
  didRender(){
    this.resize()
  },

  didDestroyElement(){
    this.resize()
  },
  resize(){
    $.fn.matchHeight._maintainScroll = true;
    Ember.$('.sameblock').matchHeight({
      byRow: true,
      property: 'height',
      target: null,
      remove: false
    })
  },

  initProperties: on('init', function () {
    this.get('getPropertie')('/pbxgroups/pbx_users').then((response) => {
      if (!this.isDestroyed) {
        trySet(this, 'pbxUserProperties', response)
      }
    })
  }),

  actions: {
    setProperty(propertie, value) {
      this.set(propertie, value);
      return value
    },
  }
});
