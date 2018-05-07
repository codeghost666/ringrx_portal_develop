class VoicemailMailbox < RestModel
  include ActiveModel::Validations

  property :mailbox #Display Only
  property :pin
  property :transcription #Display Only
  property :play_envelope
  property :quota #Display Only
  property :quota_use #Display Only
  property :email_content
  property :email_notification
  property :greeting
  property :mwi

  property :id, field: :_id

  validates :pin, length: {minimum: 4, maximum: 9}

  def self.load_by_user(currentUser, message_folder = nil)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    response = JSON.parse(HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).body)
    # TODO: Swap this for the MyPhone object once it's ready?
    userDataReqURL = "#{currentUser[:backend]}/api/v1/portal_my_phone"
    userData = JSON.parse(HTTParty.get(userDataReqURL, :headers => getHeaders(currentUser), :verify => false).body)
    response["email_content"] = userData["vm_email_content"]
    response["email_notification"] = userData["vm_email_notification"]
    VoicemailMailbox.from_source(response).first
  end

  def self.mwi_by_user(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    response = JSON.parse(HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).body)
    return response['mwi']['new']
  end

  def self.load_from_json(vmJson)
    VoicemailMailbox.from_source(JSON.parse(vmJson)).first
  end

  def self.get_greeting(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/greeting"
    RestClient::Request.execute(
        method: :get,
        url: requestURL,
        headers: getHeaders(currentUser),
        verify_ssl: false
    )
  end

  def self.save_greeting(currentUser, greeting)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    RestClient::Request.execute(
        method: :put,
        url: requestURL,
        payload: {greeting: greeting},
        headers: {
            'Content-Type' => "multipart/form-data",
            Authorization: "Bearer #{JsonWebToken.encode(currentUser)}",
            :Accept => "*/*"
        },
        verify_ssl: false
    )
  end

  def save(currentUser)
    # Need to save VM Notifications too
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    # Notifications URL
    userDataReqURL = "#{currentUser[:backend]}/api/v1/portal_my_phone"
    response = HTTParty.put(userDataReqURL, :headers => getHeaders(currentUser), :body => {:vm_email_content => email_content, :vm_email_notification => email_notification}.to_json, :verify => false)
    if (response.code != 200)
      response
    end
    HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
  end

  private

  def baseURL
    "/api/v1/portal_voicemail_mailbox"
  end

  def getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

  def self.baseURL
    "/api/v1/portal_voicemail_mailbox"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end
