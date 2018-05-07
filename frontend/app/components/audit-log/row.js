import Component from '@ember/component'

export default Component.extend({
  tagName: 'tr',

  didRender () {
    this.$('.td-collapse').hide()
  },
  actions: {
    collapsArrow () {
      this.$('.collapse-arrow').parents('tr').find('.td-collapse').slideToggle('slow')
    }
  }
})
