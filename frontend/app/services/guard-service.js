import Service from '@ember/service'
import { inject as service } from '@ember/service'
import { computed } from '@ember/object'
import jwtDecode from 'jwt-decode'

export default Service.extend({
  session: service(),

  isAdmin: computed('session.isAuthenticated', async function () {
    if (this.get('session.isAuthenticated')) {
      return this.get('session.store').restore().then((data) => {
        let token = data.authenticated.access_token
        let decodeToken = jwtDecode(token)
        return decodeToken.role =='admin'
      })
    } else {
      return Promise.reject()
    }
  })
})
