import Component from '@ember/component'
import { computed } from '@ember/object'
import Ember from 'ember'

export default Component.extend({
  classNames: 'item-coll',
  classNameBindings: ['haveGaps'],
  noRules: computed.empty('rules'),
  didRender () {
    Ember.run.schedule('afterRender', this, function () {
      $('.week-schedule  .item-coll').matchHeight({
        byRow: false,
        property: 'height',
        target: null,
        remove: false
      })
    })
  }
})
