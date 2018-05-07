import Component from '@ember/component'
import { computed} from '@ember/object'
import Ember from 'ember'
import { memberAction } from 'ember-api-actions'
import { task } from 'ember-concurrency'
import FileSaverMixin from 'ember-cli-file-saver/mixins/file-saver'

export default Component.extend(FileSaverMixin, {
  notifications: Ember.inject.service('notification-messages'),
  tagName: 'tr',
  timeout: 1000,
  isShowingHistory: false,
  isShowingMessage: false,
  statusSpinner: false,
  contentTypes: {
    'wav': 'audio/x-wav',
    'mp3': 'audio/mp3',
    'pdf': 'application/pdf',
    'tiff': 'image/tiff',
    'tif': 'image/tiff'
  },

  didInsertElement () {
    this.$('.td-collapse').hide()
  },

  isVoiceMail: computed('message.messageType', function () {
    return this.get('message.messageType') == 'voicemail'
  }),

  isNoHistory: computed.empty('message.history'),

  iconClass: computed('message.messageType', function () {
    switch (this.get('message.messageType')) {
      case 'voicemail':
        return 'icon-play'
      case 'oncall':
        return 'icon-play'
      case 'fax':
        return 'icon-page-1'
      case 'message':
        return 'icon-mail'
    }
  }),
  cbState: computed('onInit', 'message.status', {
    get (key) {
      return this.get('message').get('status') != 'read'
    },

    set (key, value) {
      if (!this.get('statusSpinner')) {
        this.set('statusSpinner', true)
        try {
          Ember.run.debounce(this, this.setStatus, parseInt(this.get('timeout'), 10), false)

        } catch (exception) {

          if (window.console) { window.console.error('setContent', exception) }
        }
      }
    }
  }),

  setStatus () {
    let message = this.get('message')
    let state = this.get('message').get('status') != 'read'
    let value = state ? 'read' : 'new'
    this.get('updateMessage')(message, 'status', value, this).then(() => {
      this.get('notifications').success('Inbox message updated successfully!', {
        autoClear: true,
        clearDuration: 6200
      })
    }, () => {
      message.rollbackAttributes()
      this.get('notifications').error('Could not update. Please try later.', {
        autoClear: true,
        clearDuration: 6200
      })
    }).finally(() => {
      this.set('statusSpinner', false)
    })
  },

  downloadVoiceMail: task(function * () {
    yield this.get('getVoiceMail')(this.get('message')).then((content) => {
      let fileName = !(this.get('message.voicemail')) ? 'voicemail.mp3' : this.get('message.voicemail')
      let extension = fileName.split('.').pop()
      this.saveFileAs(fileName, content, this.get('contentTypes')[extension])
    }, () => {
      this.get('notifications').error('Could not download file. Please try later.', {
        autoClear: true,
        clearDuration: 6200
      })
    })
  }).drop(),

  actions: {

    toTrash () {
      let message = this.get('message')
      this.get('updateMessage')(message, 'messageFolder', 'trash').then(() => {
        this.get('notifications').success('Moved to trash successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
      }, () => {
        message.rollbackAttributes()
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    showHistory () {
      this.toggleProperty('isShowingHistory')
    },

    showMessage () {
      switch (this.get('message.messageType')) {
        case 'voicemail':
          this.toggleProperty('isShowingMessage')
          break
        case 'oncall':
          break
        case 'fax':
          this.message.faxPayload().then((content) => {
            let fileName = !(this.get('message.fax')) ? 'newFax.pdf' : this.get('message.fax')
            let extension = fileName.split('.').pop()
            this.saveFileAs(fileName, content, this.get('contentTypes')[extension])
          })
          break
        case 'message':
          break
      }
    },

    closeMessageDialog () {
      this.toggleProperty('isShowingMessage')
    }
  }
})
