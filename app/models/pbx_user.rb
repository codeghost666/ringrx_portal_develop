class PbxUser < RestModel
  include ActiveModel::Validations

  property :pbx_account_id
  property :name
  property :extension
  property :username
  property :password # This will never come back, but should be in the model
  property :sip_password
  property :pin
  property :max_bindings
  property :external_callerid_name
  property :external_callerid_number
  property :email
  property :mobile
  property :call_timeout
  property :forward_behavior
  property :pbx_location_id
  property :mailbox
  property :vm_email_notification
  property :vm_email_content
  property :fax_ext
  property :enable_mobile_stun
  property :oncall_remind_minutes
  property :oncall_remind_email
  property :oncall_remind_sms
  property :sms_enable
  property :role
  #property :pbx_mailbox_users
  #property :pbx_mailbox_schedules
  property :id

  validates :name, presence: true
  validates :extension, presence: true
  validates :sip_password, presence: true
  validates :pin, presence: true, length: {minimum: 4, maximum: 9}
  validates :pbx_location_id, presence: true
  validates :pbx_account_id, presence: true
  validates :username, presence: true
  validates :role, :inclusion => {:in => lambda { |u| u.class::ROLE.values }}
  validates :forward_behavior, :inclusion => {:in => lambda { |u| u.class::FORWARD.values }}
  validates :max_bindings, numericality: {less_than_or_equal_to: 32}, presence: true
  validates :call_timeout, numericality: {less_than_or_equal_to: 100}, presence: true

  ROLE = {
      'User' => 'user',
      'Admin' => 'admin',
  }

  FORWARD = {
      'Ring My Phone' => 'endpoint',
      'Simultaneous Ring' => 'simring',
      'Sequential' => 'sequential',
      'Forward' => 'forward'
  }

  def self.load_by_user_id(currentUser, id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    if response.code != 200
      response
    else
      PbxUser.from_source(response.parsed_response).first
    end
  end

  def self.load_by_user(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    if response.code != 200
      response
    else
      PbxUser.from_source(response.parsed_response)
    end
  end

  def self.load_from_json(json)
    PbxUser.from_source(JSON.parse(json)).first
  end

  def self.get_forward_behaviors(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/forwardbehaviors"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.get_oncall_behaviors(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/oncallbehaviors"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.mailboxes(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/mailboxes"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.roles(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/roles"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.locations(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/locations"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.fax_extensions(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/fax_extensions"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def save(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}"
    if id.nil?
      response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    else
      response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    end
    if response.code == 200 && id.nil?
      self.id = JSON.parse(response.body)['id']
      self.extension = JSON.parse(response.body)['extension']
    end
    response
  end

  def self.delete(currentUser, id)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
    HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
  end

  private

  def baseURL
    "/api/v1/portal_pbx_users"
  end

  def getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

  def self.baseURL
    "/api/v1/portal_pbx_users"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end