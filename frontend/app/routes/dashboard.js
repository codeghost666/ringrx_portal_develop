import Route from '@ember/routing/route'
import RSVP from 'rsvp'

export default Route.extend({

  model () {
    return RSVP.hash({
      oncalls: this.get('store').findAll('pbxOnCall'),
      voicemail: this.get('store').findAll('voicemail'),
      calls: this.get('store').query('cdr', {
        startDate: moment().format('DD-MM-YYYY'),
        endDate: moment().format('DD-MM-YYYY')
      })
    })
  },
  setupController (controller, model) {
    // Call _super for default behavior
    this._super(controller, model)
    // Implement your custom setup after
    this.controllerFor('dashboard').set('oncallId', model.oncalls.get('firstObject.id'))
  },
})
