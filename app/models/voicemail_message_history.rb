class VoicemailMessageHistory < RestModel
    belongs_to :voicemailmessage

    property :id
    property :creator
    property :event_body
    property :created_at
    belongs_to :voicemail_message
end
  