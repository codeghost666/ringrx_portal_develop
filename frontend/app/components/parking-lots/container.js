import Component from '@ember/component';
import Ember from "ember"
import config from '../../config/environment'

export default Component.extend({
  paginationProperty: config.paginationProperty,
  paginateBy: 10,
  didRender(){
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
  actions: {
    setProperty(propertie, value) {
      this.set(propertie, value);
      return value
    },
  }
});
