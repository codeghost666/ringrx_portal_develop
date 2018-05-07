import Component from '@ember/component'
import Ember from 'ember'

export default Component.extend({
  modalTitle: '',
  isShowingModal: false,
  classNames: 'modal-box',
  elementId: '',
  didInsertElement () {
    $('body').addClass('modal-open')
    this.$().css({'top': '0', 'opacity': '1'})
    let windowHeight = $(window).height(),
      elemHeight = $('.modal-box-inner').height(),
      modalTop = (windowHeight - elemHeight + 310) / 2 - 50
    this.$('.modal-box-inner').css({'margin-top': modalTop + 'px'})
    $(window).resize(() => {
      if ($('.modal-box-inner')) {
        let windowHeight = $(window).height(),
          elemHeight = $('.modal-box-inner').height(),
          modalTop = (windowHeight - elemHeight) / 2 - 50
        $('.modal-box-inner').css({'margin-top': modalTop + 'px'})
      }
    })
  },

  didDestroyElement () {
    Ember.$('body').removeClass('modal-open')
  },
  actions:{
    closeModal(){
      this.toggleProperty('isShowingModal')
    },

    resize(){
      let windowHeight = $(window).height(),
        elemHeight = $('.modal-box-inner').height(),
        modalTop = (windowHeight - elemHeight) / 2 - 50
      this.$('.modal-box-inner').css({'margin-top': modalTop + 'px'})
    }
  }
})
