import { Factory, faker } from 'ember-cli-mirage'

export default Factory.extend({
  id (n) {return n},
  name () {
    return faker.name.firstName() + ';' + faker.name.lastName()
  },
  org: 'Downtown Radiology',
  contact_type () {
    return faker.random.arrayElement(['private', 'group'])
  }
})
