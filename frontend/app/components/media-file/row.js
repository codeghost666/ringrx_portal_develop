import Component from '@ember/component'
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',

  deleteMediaFile: task(function * () {
      yield this.get('deleteRecord')(this.get('mediaFile'))
    }
  ).drop(),

  actions: {}
})
