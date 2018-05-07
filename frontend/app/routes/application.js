import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  routeAfterAuthentication: 'dashboard',

  actions: {
    getNewMessagesCount(){
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL() + '/voicemails/count'
      return adapter.ajax(baseUrl, 'GET')
    }
  }
});
