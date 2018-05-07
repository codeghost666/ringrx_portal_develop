import Component from '@ember/component'
import { on } from '@ember/object/evented'
import Ember from 'ember'

export default Component.extend({
  homeHeaderInit: on('didInsertElement', function () {
    this.$().scroll(
      function () {
        var topScroll = $(this).scrollTop()
        if (topScroll > 150) {
          $('.header').addClass('header-scroll')
        }
        else if (topScroll < 150) {
          $('.header').removeClass('header-scroll')
        }
      }
    )
  }),

  didInsertElement () {
    Ember.$('body').addClass('gray-bg')
  },
  willDestroyElement(){
    Ember.$('body').removeClass('gray-bg')
  },

  actions: {
    mobileLeftMenuOpen () {
      this.$('.mobile-left-menu').addClass('open')
      this.$('.overlay').fadeIn(500)
    },

    mobileLeftMenuClose () {
      this.$('.mobile-left-menu').removeClass('open')
      this.$('.overlay').fadeOut(500)
    }
  }

})
