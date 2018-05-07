import Route from '@ember/routing/route'
import Ember from 'ember'

export default Route.extend({
  hifi: Ember.inject.service(),
  session: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),

  model () {
    return this.modelFor('my-phone')
  },

  actions: {
    updateMyphone: async function (changeset) {
      let token
      this.get('session.store').restore().then((data) => {
        token = data.authenticated.access_token
      })
      let response = {}
      let file = await changeset.get('greeting')
      if (file) {
        try {
          response = await
            file.upload('/mailboxes/greeting', {
              method: 'PATCH',
              headers: {'authorization': `Bearer ${token}`}
            })
        } catch (e) {
          this.get('notifications').error('Can not save file. Please try later.', {
            autoClear: true,
            clearDuration: 6200
          })
          response = null
        } finally {
          changeset.set('greeting', '')
        }

        if (response && response.status == 200) {
          this.get('hifi').set('currentSound', null)
          return changeset.save()
        } else {
          return null
        }
      } else {
        return changeset.save()
      }
    },

    rollbackMyphone (changeset) {
      changeset.set('greeting', '')
      return changeset.rollback()
    },

    play (changeset) {
      let requestType = 'GET'
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL()
      let fullUrl = `${baseUrl}/mailboxes/greeting`
      let request = adapter.ajax(fullUrl, requestType, {arraybuffer: true})
      let urlPromice = request.then((content) => {
        let URL = window.URL || window.webkitURL
        let blob = new Blob([content], {type: 'octet/stream'})
        return URL.createObjectURL(blob)
      })
      return this.get('hifi').play(urlPromice)
    },
    updatePassword(passwordObj){
      let adapter = this.store.adapterFor('application')
      let baseUrl = adapter.buildURL('myphone') + '/password'
      return adapter.ajax(baseUrl, 'post', {
        data: {
          current_password: passwordObj.currentPassword,
          new_password: passwordObj.newPassword
        }
      }).then(()=>{
        this.get('notifications').success('Password have updated successfully.', {
          autoClear: true,
          clearDuration: 6200
        })
      },()=>{
        this.get('notifications').error('Something go wrong. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
