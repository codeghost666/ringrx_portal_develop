import Component from '@ember/component'
import Ember from 'ember'
import { task } from 'ember-concurrency'
import { inject as service } from '@ember/service'

export default Component.extend({
  email: '',
  emailRegex: /^([\w+-].?)+@[a-z\d-]+(\.[a-z]+)*\.[a-z]+$/,
  notifications: service('notification-messages'),

  sendInstruction: task(function * () {
    if (this.get('email').match(this.get('emailRegex'))){
      yield this.get('sendData')(this.get('email'))
    } else{
      this.get('notifications').error('Please input correct email address and try submitting again.', {
        autoClear: true,
        clearDuration: 6200
      })
    }
  }).drop(),

})
