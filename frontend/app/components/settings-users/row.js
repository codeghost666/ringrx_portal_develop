import Component from '@ember/component';
import { task } from 'ember-concurrency'

export default Component.extend({
  tagName: 'tr',
  deleteUser: task(function * () {
      yield this.get('deleteRecord')(this.get('user'))
    }
  ).drop()

});
