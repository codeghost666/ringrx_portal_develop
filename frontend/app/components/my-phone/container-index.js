import Component from '@ember/component'
import Ember from 'ember'
import { get, set, computed } from '@ember/object'
import config from '../../config/environment'

export default Component.extend({
  notifications: Ember.inject.service('notification-messages'),
  uploader: Ember.inject.service('file-queue'),
  classNames: 'tab-pane active',
  forward: {
    'endpoint': 'Ring My phone',
    'simring': 'Simultaneous Ring',
    'sequential': 'Sequential',
    'forward': 'Forward'
  },
  timeout: 3000,
  changeset: {},
  startPlay: true,
  statusSpinner: false,
  isShowingChangePassword: false,

  saveMyphone () {
    let changeset = this.get('changeset')
    changeset.validate().then(() => {
      if (changeset.get('isValid')) {
        let responce = this.get('save')(changeset)
        if (responce) {
          responce.then((res) => {
            if (res) {
              this.set('startPlay', true)
              this.get('notifications').success('Saved successfully!', {
                autoClear: true,
                clearDuration: 6200
              })
              this.set('statusSpinner', false)
            }
          })
        } else {
          this.get('notifications').error('Can not update. Please try later.', {
            autoClear: true,
            clearDuration: 6200
          })
          this.set('statusSpinner', false)
        }
      } else {
        this.get('notifications').error('Change a few things up and try submitting again.', {
          autoClear: true,
          clearDuration: 6200
        })
        this.set('statusSpinner', false)
      }
    })
  },

  showForwardBehavior: computed('changeset.forwardBehavior', function () {
    let key = this.get('changeset').get('forwardBehavior')
    return this.get('forward')[key]
  }),

  qrcodeString: computed('changeset.email', 'changeset.password', function () {
    let password = this.get('changeset').get('password')
    return `csc:${this.get('changeset').get('email')}:${password ? password : ''}@RINGRX${!config.isProduction ? '*' : ''}`
  }),

  actions: {

    rollback () {
      this.attrs.rollback(this.get('changeset'))
    },

    saveButtonClick () {
      if (!this.get('statusSpinner')) {
        this.set('statusSpinner', true)
        try {
          Ember.run.debounce(this, this.saveMyphone, parseInt(this.get('timeout'), 10), false)

        } catch (exception) {

          if (window.console) {
            window.console.error('saveButtonClick', exception)
          }
        }
      }
    },

    validateProperty (changeset, property,) {
      if (changeset.get(property) === '_@_._') {
        changeset.set(property, '')
      }
      return changeset.validate(property)
    },

    setGreeting: async function (file) {
      let changeset = this.get('changeset')
      changeset.set('greeting', file)
      let url = await file.readAsDataURL()
      file.set('url', url)
    },

    setForwardBehavior (value) {
      this.get('changeset').set('forwardBehavior', value)
      return value
    },

    changePassword () {
      this.toggleProperty('isShowingChangePassword')
    }
  }
})
