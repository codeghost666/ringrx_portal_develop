import { Factory, faker } from 'ember-cli-mirage'
import moment from 'moment'

export default Factory.extend({
  id (n) {
    return n + 1
  },
  caller () {
    return '+' + faker.random.number({min: 1000000000, max: 1999999999})
  },
  created_at () {
    return moment(faker.date.between('2017-12-01', '2018-04-01')).format()
  },
  status () {
    return faker.random.arrayElement(['new', 'read'])
  },
  message_folder () {
    return faker.random.arrayElement(['inbox', 'outbox', 'sent', 'trash'])
  },
  message_type () {
    return faker.random.arrayElement(['voicemail', 'oncall', 'fax', 'message'])
  },
  history: [
    {
      creator: 'name',
      eventBody: 'something happened',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name1',
      eventBody: 'something happened1',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name2',
      eventBody: 'something happened2',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name3',
      eventBody: 'something happened3',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name',
      eventBody: 'something happened',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name1',
      eventBody: 'something happened1',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name2',
      eventBody: 'something happened2',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name3',
      eventBody: 'something happened3',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name',
      eventBody: 'something happened',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name1',
      eventBody: 'something happened1',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name2',
      eventBody: 'something happened2',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
    {
      creator: 'name3',
      eventBody: 'something happened3',
      createdAt: moment(faker.date.between('2017-12-01', '2018-02-12')).format()
    },
  ]
})
