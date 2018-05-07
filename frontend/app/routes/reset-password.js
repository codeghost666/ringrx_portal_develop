import Route from '@ember/routing/route'
import { inject as service } from '@ember/service'
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin'

export default Route.extend(UnauthenticatedRouteMixin, {
  routeIfAlreadyAuthenticated: 'dashboard',
  notifications: service('notification-messages'),

  model (params) {
    this.set('resetPasswordToken', params.resetPasswordToken)
  },

  actions: {
    resetPassword (passwordObj) {
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL() + '/auth/reset'
      return adapter.ajax(baseUrl, 'patch', {
        data: {
          reset_password_token: this.get('resetPasswordToken'),
          password: passwordObj.password,
          password_confirmation: passwordObj.passwordConfirmation
        }
      }).then(() => {
        this.get('notifications').success('Password have updated successfully.', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('login')
      }, () => {
        this.get('notifications').error('Something go wrong. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
