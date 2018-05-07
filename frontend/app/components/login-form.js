import Component from '@ember/component'
import { observer } from '@ember/object'
import { inject as service } from '@ember/service'
import { on } from '@ember/object/evented'
import { task } from 'ember-concurrency'

export default Component.extend({
  session: service(),
  notifications: service('notification-messages'),
  rememberMe: true,

  _rememberMeChanged: observer('rememberMe', function () {
    const expirationTime = this.get('rememberMe') ? (14 * 24 * 60 * 60) : null
    this.set('session.store.cookieExpirationTime', expirationTime)
  }),

  authenticate: task(function * () {
    var credentials = this.getProperties('identification', 'password'),
      authenticator = 'authenticator:jwt'
    yield this.get('session').authenticate(authenticator, credentials).then(() => {
      if (!this.get('rememberMe')) {
        this.set('session.store.cookieExpirationTime', null)
      }
      this.get('notifications').success('You successfully logged in!', {
        autoClear: true,
        clearDuration: 6200
      })
    }, (reason) => {
      this.get('notifications').error('Login failed. Invalid username or password.', {
        autoClear: true,
        clearDuration: 6200
      })
    })
  }).drop()
})
