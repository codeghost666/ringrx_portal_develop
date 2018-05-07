import Route from '@ember/routing/route'
import Ember from 'ember'
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend( UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated:  'dashboard',
  notifications: Ember.inject.service('notification-messages'),

  actions: {
    sendData (email) {
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL() + '/auth/send_reset'
      return adapter.ajax(baseUrl, 'post', {
        data: {
          username: email
        }
      }).then(()=>{
        this.get('notifications').success('Instructions to reset password were sent to your email. Please check them.', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('login')
      },()=>{
        this.get('notifications').error('Something go wrong. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
