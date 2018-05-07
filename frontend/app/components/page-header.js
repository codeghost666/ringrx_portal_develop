import Component from '@ember/component'
import { on } from '@ember/object/evented'
import {inject as service} from '@ember/service'
import {trySet} from '@ember/object'
import { computed } from '@ember/object'

export default Component.extend({
  newMessagesCount: 0,
  session: service(),
  guardService: service(),

  initNewMessagesCount: on('init', function(){
    this.get('getNewMessagesCount')().then((response)=>{
      if (!this.isDestroyed) {
        trySet(this, 'newMessagesCount', response)
      }
    })
  }),

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

  actions: {
    mobileLeftMenuOpen () {
      this.$('.mobile-left-menu').addClass('open')
      this.$('.overlay').fadeIn(500)
    },

    mobileLeftMenuClose () {
      this.$('.mobile-left-menu').removeClass('open')
      this.$('.overlay').fadeOut(500)
    },

    logout: function() {
      this.get('session').invalidate();
    }
  }

})
