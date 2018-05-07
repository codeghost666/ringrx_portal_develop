import Route from '@ember/routing/route'
import moment from 'moment'
import { set } from '@ember/object'
import RSVP from 'rsvp'
import Ember from 'ember'
import { inject as service } from '@ember/service'
import BuildURLMixin from 'ember-data'

export default Route.extend(BuildURLMixin, {
  hifi: service(),
  session: service(),
  notifications: service('notification-messages'),

  model () {
    return RSVP.hash({
      voicemail: this.get('store').findAll('voicemail'),
      mailbox: this.get('store').findAll('mailbox')
    })
  },

  setupController (controller, model) {
    this._super(controller, model)
    let startDate = moment().subtract(30, 'day')
    let endDate = moment()
    this.controllerFor('messagesFaxes.index').setProperties({
      startDateInbox: startDate,
      endDateInbox: endDate,
      startDateSent: startDate,
      endDateSent: endDate,
      startDateTrash: startDate,
      endDateTrash: endDate
    })
  },

  actions: {
    updateMessage (message, attr, value) {
      message.set(attr, value)
      return message.save()
    },

    updateMailbox: async function (changeset) {
      let token
      this.get('session.store').restore().then((data) => {
        token = data.authenticated.access_token
      })
      let response = {}
      let file = await changeset.get('greetingFile')
      if (file) {
        try {
          response = await file.upload('/mailboxes/greeting', {
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
          changeset.set('greetingFile', null)
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

    rollbackMailbox (changeset) {
      changeset.set('greetingFile', null)
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

    playMediaFile (changeset) {
      let URL = window.URL || window.webkitURL
      if (!changeset.get('voicePayloadFile')) {
        let urlPromise = changeset.voicePayload().then((content) => {
          changeset.set('voicePayloadFile', content)
          return URL.createObjectURL(content)
        })
        return this.get('hifi').play(urlPromise)
      } else {
        let fileUrl = URL.createObjectURL(changeset.get('voicePayloadFile'))
        return this.get('hifi').play(fileUrl)
      }
    },

    getVoiceMail (changeset) {
      if (changeset.get('voicePayloadFile')) {
        return Promise.resolve(changeset.get('voicePayloadFile'))
      } else {
        return changeset.voicePayload().then((content) => {
          changeset.set('voicePayloadFile', content)
          return content
        })
      }
    },

    saveChanges (message) {
      return message.save().then(() => {
        this.get('notifications').success('Note has updated successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        this.get('notifications').error('Can not updated note. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    }
  }
})
