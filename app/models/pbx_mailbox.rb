class PbxMailbox < RestModel
  include ActiveModel::Validations
  property :name
  property :pbx_account_id
  property :mailbox #Display Only
  property :pin
  property :transcription #Display Only
  property :play_envelope
  property :email_content
  property :email_notification


  property :id

  validates :pin, length: {minimum: 4, maximum: 9}

  def self.load_by_user(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    response = JSON.parse(HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).body)
    PbxMailbox.from_source(response)
  end

  def self.load_from_json(vmJson)
    PbxMailbox.from_source(JSON.parse(vmJson)).first
  end

  def self.status_by_user(currentUser, mailbox_id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{mailbox_id}/status"
    response = JSON.parse(HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).body)
    VoicemailMailbox.from_source(response)
  end

  def self.get_greeting(currentUser, mailbox_id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{mailbox_id}/greeting"
    RestClient::Request.execute(
        method: :get,
        url: requestURL,
        headers: getHeaders(currentUser),
        verify_ssl: false
    )
  end

  def self.save_greeting(currentUser, mailbox_id, greeting)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{mailbox_id}"
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
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    if id.nil?
      response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    else
      response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    end
    if response.code == 200 && id.nil?
      self.id = JSON.parse(response.body)['id'].to_s
    end
    response
  end

  private

  def baseURL
    "/api/v1/portal_pbx_mailboxes"
  end

  def getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

  def self.baseURL
    "/api/v1/portal_pbx_mailboxes"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end
