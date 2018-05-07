import moment from 'moment'

export default function () {
  this.get('/contacts', (schema) => {
    return schema.contacts.all().models
  })

  this.post('/auth/token', () => {
    return {
      data: {accessToken: 'token'}
    }
  })

  this.get('/cdrs', (schema, request) => {
    let startDate = moment(request.queryParams.startDate, 'DD-MM-YYYY')
    let endDate = moment(request.queryParams.endDate, 'DD-MM-YYYY')
    return schema.cdrs.all().filter((cdr) => {
      return moment(cdr.start_time).isBetween(startDate, endDate) || moment(cdr.start_time).isSame(startDate, 'day')
    }).models
  })

  this.get('/voicemails', (schema) => {
    return schema.voicemails.all().models
  })
  this.get('/voicemails/:id', (schema, request) => {
    let id = request.params.id

    return schema.voicemails.find(id).attrs
  })

  this.patch('/voicemails/:id', (schema, request) => {
    let attrs = JSON.parse(request.requestBody)
    let id = request.params.id
    let message = schema.voicemails.find(id)
    message.update(attrs)
    return message.attrs
  })

  this.get('/mailboxes', () => {
    return {
        'mailbox': 'ann@test.ringrx.com',
        'pin': '04517897',
        'transcription': 'true',
        'play_envelope': 'false',
        'quota': '104857600',
        'quota_use': '0',
        'email_content': 'test1@mail.com',
        'email_notification': 'test@mail.com',
        'id': '255f407f00a81c09223d0bebe01f33af'
      }
  })

  this.get('/phonenumbers', (schema) => {
    return schema.phonenumbers.all().models
  })

  this.get('/pbxoncalls', ()=>{
    return [
      {
        "pbx_oncall_shifts": [
          {
            "pbx_oncall_shift_users": [
              {"id": 1,
                "pbx_oncall_shift_id": 17,
                "pbx_user_id":2,
                "priority":1,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              },
              {"id": 2,
                "pbx_oncall_shift_id": 17,
                "pbx_user_id":3,
                "priority":2,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              }
            ],
            "day_fri": "false",
            "day_mon": "false",
            "day_sat": "false",
            "day_sun": "false",
            "day_thu": "false",
            "day_tue": "false",
            "day_wed": "false",
            "start_at": "2018-02-26T03:00:00.000-00:00",
            "end_at": "2018-02-26T05:00:00.000-00:00",
            "end_time": "2000-01-01T15:59:00.000-00:00",
            "id": "17",
            "metric": "262740",
            "name": "Shift 17",
            "pbx_oncall_id": "9",
            "priority": "1",
            "start_time": "1999-12-31T16:00:00.000-00:00"
          },
          {
            "pbx_oncall_shift_users": [
              {"id": 3,
                "pbx_oncall_shift_id": 18,
                "pbx_user_id":6,
                "priority":2,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              },
              {"id": 4,
                "pbx_oncall_shift_id": 18,
                "pbx_user_id":4,
                "priority":1,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              }
            ],
            "day_fri": "false",
            "day_mon": "false",
            "day_sat": "false",
            "day_sun": "false",
            "day_thu": "false",
            "day_tue": "false",
            "day_wed": "false",
            "start_at": "2018-02-26T02:00:00.000-00:00",
            "end_at": "2018-02-26T08:00:00.000-00:00",
            "end_time": "2000-01-01T15:59:00.000-00:00",
            "id": "18",
            "metric": "262740",
            "name": "Shift 17",
            "pbx_oncall_id": "9",
            "priority": "2",
            "start_time": "1999-12-31T16:00:00.000-00:00"
          },
          {
            "pbx_oncall_shift_users": [
              {"id": 5,
                "pbx_oncall_shift_id": 19,
                "pbx_user_id":20,
                "priority":1,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              },
              {
                "id": 6,
                "pbx_oncall_shift_id": 19,
                "pbx_user_id":60,
                "priority":2,
                "suppress_reminder":"2018-02-18T03:04:36.000Z"
              }
            ],
            "day_fri": "false",
            "day_mon": "true",
            "day_sat": "false",
            "day_sun": "false",
            "day_thu": "false",
            "day_tue": "false",
            "day_wed": "false",
            "start_at": null,
            "end_at": null,
            "end_time": "2000-01-01T04:00:00.000-00:00",
            "id": "19",
            "metric": "262740",
            "name": "Shift 17",
            "pbx_oncall_id": "9",
            "priority": "1",
            "start_time": "2000-01-01T18:00:00.000-00:00"
          }

        ],
        "callerid": "8183039450",
        "extension": "987",
        "greeting": "",
        "id": "9",
        "mailbox": "OnCall_824@test.ringrx.com",
        "minutes": 5,
        "moh": "miami_viceroy.mp3",
        "name": "OnCall_987",
        "pbx_account_id": "1",
        "record_calls": "false",
        "retries": 3,
        "shift_alarm": "ryan@ringrx.com",
        "shift_alarm_minutes": 60,
        "shift_alarm_supress": null
      }
    ]
  })

  this.get('/pbxoncalls/pbx_users', ()=>{
    return {
      2: "Luca",
      3: "Henry remache",
      4: "Doug",
      5: "dougcel",
      6: "Ryan Delgrosso",
      7: "Doug Vta",
      8: "Robyn",
      20: "Anna Panchuk",
      21: "Ikantam Test",
      50: "Test User Edited",
      60: "Damon"
    }
  })

}
