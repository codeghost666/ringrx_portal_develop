import Route from '@ember/routing/route'

export default Route.extend({
  model () {
    return this.modelFor('settings.phone-numbers')
  },

  actions: {
    getPropertie(path){
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL()
      return adapter.ajax(baseUrl + path, 'GET')
    }
  }
})
