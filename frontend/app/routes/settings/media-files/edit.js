import Route from '@ember/routing/route';
import { inject as service } from '@ember/service'

export default Route.extend({
  hifi: service('hifi'),
  session: service('session'),
  notifications: service('notification-messages'),

  model(params){
    return this.get('store').peekRecord('pbxMediaFile', params.pbxMediaFile_id)
  },

  actions: {
    updateMediaFile (changeset) {
      return changeset.save().then(() => {
        this.modelFor(this.routeName).set('currentSound', null)
        this.get('notifications').success('Saved successfully!', {
          autoClear: true,
          clearDuration: 6200
        })
        this.transitionTo('settings.media-files')
      }, (e) => {
        this.get('notifications').error('Can not update. Please try later.', {
          autoClear: true,
          clearDuration: 6200
        })
      })
    },

    playMediaFile (model) {
      let urlPromice = model.download().then((content) => {
        let URL = window.URL || window.webkitURL
        return URL.createObjectURL(content)
      })
      return this.get('hifi').play(urlPromice)
    },

    rollbackMediaFile (changeset) {
      changeset.rollback()
      this.transitionTo('settings.media-files')
    },

    willTransition () {
      let model = this.controller.get('model')

      if (model.get('isNew')) {
        model.send('becameInvalid');
        model.unloadRecord();
      }
    }
  }
});
