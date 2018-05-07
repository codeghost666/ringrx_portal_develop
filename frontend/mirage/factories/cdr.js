import { Factory, faker } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({

  id (n) {return n},
  pbx_account_id: 1,
  start_time () {
    return moment(faker.date.between('2017-10-01', '2018-04-08')).format()
  },
  hangup_cause () {
    return faker.random.arrayElement(['ORIGINATOR_CANCEL', 'NORMAL_CLEARING'])
  },
  caller_id_number () {
    return '+' + faker.random.number({min: 1000000000, max: 1999999999})
  },
  caller_id_name () {
    return faker.name.firstName()
  },
  called_party () {
    return '+' + faker.random.number({min: 1000000000, max: 1999999999})
  },
  bill_duration () {
    return faker.random.number(7200)
  },
})

