class VoicemailMessage < RestModel
    include ActiveModel::Validations

  embeds_many :history, class_name: :VoicemailMessageHistory

  property :mailbox
  property :caller
  #property :called
  property :created_at
  property :transcription
  property :status, default: 'new'
  property :message_type
  property :message_folder, default: 'inbox'
  property :voicemail
  property :fax
  #property :message
  #property :duration
  #property :pages
  #property :retry
  property :notes
  #property :contact
  #property :oncall_callid
  #property :oncall_id
  property :id, field: :_id

    validates :mailbox, :caller, :status, :message_type, presence: true
    #validates :mailbox, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }
    validates_inclusion_of :message_type, in: %w( voicemail oncall fax message )
    validates_inclusion_of :message_folder, in: %w( inbox outbox sent trash )
    validates_inclusion_of :status, in: %w( new read pending sending sent )

    def self.load_by_message_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        VoicemailMessage.from_source(JSON.parse(response.body)).first
    end

    def self.load_by_user(currentUser, message_folder = nil)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if (message_folder)
            queryArgs = {
            "message_folder" => message_folder
        }
        end
        response = HTTParty.get(requestURL, :query => queryArgs, :headers => getHeaders(currentUser), :verify => false)

        if response.code == 200
            VoicemailMessage.from_source(response)
        else
            response
        end
        response = HTTParty.get(requestURL, :query => queryArgs, :headers => getHeaders(currentUser), :verify => false)
        #if response.code == 404
        VoicemailMessage.from_source(response)
    end

    def self.load_from_json(vmJson)
        parsed = JSON.parse(vmJson)
        unless parsed["id"].nil?
            parsed["_id"] = parsed["id"]
        end
        VoicemailMessage.from_source(parsed).first
    end

  def self.voice_payload(currentUser, id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}/voice_payload"
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    if response.code == 404
      nil
    else
      response.body
    end
  end

  def self.fax_payload(currentUser, id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}/fax_payload"
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    if response.code == 404
      nil
    else
      response.body
    end
  end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
        response.code == 204
    end 
    
    def self.send_fax(currentUser, called_number, faxfile)
      requestURL = "#{currentUser[:backend]}/api/v1/portal_voicemail_message/submit_fax"
      RestClient::Request.execute(
          method: :post,
          url: requestURL,
          payload: {caller_number: called_number, faxfile: faxfile},
          headers: {
              'Content-Type' => "multipart/form-data",
              Authorization: "Bearer #{JsonWebToken.encode(currentUser)}",
              :Accept => "*/*"
          },
          verify_ssl: false
      )
    end

  def save(currentUser)
    if id.nil?
      requestURL = "#{currentUser[:backend]}/voicemail_message"
      response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    else
      requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
      response = HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    end
    if response.code == 200 && id.nil?
      self.id = JSON.parse(response.body)['_id']
    end
  end

    private

  def baseURL
    "/api/v1/portal_voicemail_messages"
  end

  def getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

  def self.baseURL
    "/api/v1/portal_voicemail_messages"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end