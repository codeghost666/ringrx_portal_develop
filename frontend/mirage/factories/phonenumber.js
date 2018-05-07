import { Factory, faker } from 'ember-cli-mirage';
import moment from 'moment'

  export default Factory.extend({
    id(n){
      return n + 1
      },
    phonenumber(){
      return '+' + faker.random.number({min: 1000000000, max: 1999999999})
      },
    distinctive_ring(){
      return faker.random.arrayElement(['ellcore-dr1', 'Bellcore-dr2', 'Bellcore-dr3', 'Bellcore-dr4', 'Bellcore-dr5'])
    },
    cnam_prefix(){
      return faker.lorem.word()
    },
    extension(){
      return faker.lorem.word()
    },
    pbx_location_id(){
      return faker.random.number({min: 0, max: 20})
    },
    forward_destination(){
      return '+' + faker.random.number({min: 1000000000, max: 1999999999})
    }
});

