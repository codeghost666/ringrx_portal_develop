import Route from '@ember/routing/route'
import moment from 'moment'

export default Route.extend({
  beforeModel (transition) {
    let formatDate = 'DD-MM-YYYY'
    let startDate = moment(transition.queryParams.startDate, formatDate, true)
    let endDate = moment(transition.queryParams.endDate, formatDate, true)
    if (!startDate.isValid() || !endDate.isValid() || (endDate.diff(startDate) < 0)) {
      this.replaceWith('calls', {
        queryParams: {
          endDate: moment().format(formatDate),
          startDate: moment().subtract(30, 'day').format(formatDate)
        }
      })
    }
  },

  model (params) {
    return this.get('store').query('cdr', {
        startDate: moment(params.startDate, 'DD-MM-YYYY').format('DD-MM-YYYY'),
        endDate: moment(params.endDate, 'DD-MM-YYYY').format('DD-MM-YYYY')
      }
    )
  },

  queryParams: {
    startDate: {
      refreshModel: true
    },

    endDate: {
      refreshModel: true
    }
  }
})

