import Mixin from '@ember/object/mixin'
import { inject as service } from '@ember/service'

export default Mixin.create({
  guardService: service(),
  beforeModel (transition) {
    this.get('guardService.isAdmin').then((isAdmin)=>{
      if (!isAdmin){
        this.transitionTo('not-found-route')
      }
    })
  }
})
