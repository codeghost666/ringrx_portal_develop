import Component from '@ember/component'
import Ember from 'ember'
import { computed, observer } from '@ember/object'
import { task } from 'ember-concurrency'

export default Component.extend({
  hifi: Ember.inject.service(),
  notifications: Ember.inject.service('notification-messages'),
  startPlay: true,
  divClass: '',
  sliderId: computed('changeset.id', function () {
    return `slider-${this.get('changeset').get('constructor.modelName')}-${this.get('changeset').get('id')}`
  }),
  timeout: 20,
  didInsertElement () {
    let slider = document.getElementById(this.get('sliderId'))
    let testAndWK = window.getComputedStyle(slider, '::-webkit-slider-thumb').background
    if (!testAndWK) {
      slider.style.WebkitAppearance = 'slider-horizontal'
    }
    var st = document.createElement('style')
    st.id = 's' + this.get('sliderId')
    document.head.appendChild(st)
  },

  willDestroyElement () {
    if (this.get('hifi').get('isPlaying')) {
      this.get('hifi').togglePause()
    }
    this.get('hifi').set('currentSound', null)
  },

  handlerSlider () {
    let gradValue = Math.round((this.get('changeset.currentSound.position') / this.get('changeset.currentSound.duration')) * 100)
    let grad = 'linear-gradient(90deg,#6ca5e1 ' + (gradValue + 3) + '%,#dbdbdb ' + (gradValue - 3) + '%)'
    let rangeSelector = `input[id=${this.get('sliderId')}]::`
    let styleString = rangeSelector + '-webkit-slider-runnable-track{background: ' + grad + ';} '
    document.getElementById('s' + this.get('sliderId')).textContent = styleString
  },

  sliderObserver: observer('changeset.currentSound.position', function () {
    try {
      Ember.run.debounce(this, this.handlerSlider, parseInt(this.get('timeout'), 10), false)

    } catch (exception) {

      if (window.console) { window.console.error('handlerSlider', exception) }
    }
  }),

  playSound: task(function *(){
    yield this.get('play')(this.get('changeset')).then(({sound}) => {
      this.get('changeset').set('currentSound', sound)
    }).catch(error => {
      this.get('notifications').error('There is no file to play', {
        autoClear: true,
        clearDuration: 6200
      })
    })
  }).drop(),

  actions: {
    toggle () {
      let hifi = this.get('hifi')
      if (this.get('startPlay') && !this.get('changeset').get('currentSound')) {
        this.set('startPlay', false)
        this.get('playSound').perform()
      } else {
        if (this.get('changeset').get('currentSound')) {
          if (hifi.get('currentSound') == this.get('changeset').get('currentSound')) {
            hifi.togglePause()
          } else {
            if (hifi.get('isPlaying')) {
              hifi.togglePause()
            }
            hifi.set('currentSound', this.get('changeset').get('currentSound'))
            hifi.togglePause()
          }
        }
      }
    },
  }

})
