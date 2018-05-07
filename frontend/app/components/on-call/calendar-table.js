import Component from '@ember/component';
import moment from 'moment'

export default Component.extend({
  tagName: 'table',
  classNames: "calendar-table",
  target: '',

  didInsertElement(){
    let day = moment().format('d')
    let date = moment().format('YYYY-MM-DD')
    this.$(this.$('th')[day]).addClass("today")
    this.$(`#${date}`).addClass("today")
  },
  actions: {
    showEditDialog(currentDate){
      this.sendAction('showEditContainer', currentDate)
    }
  }
});
