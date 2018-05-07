class PbxPhoneNumber < RestModel
  include ActiveModel::Validations

  embeds_many :pbx_phone_number_rules, class_name: :PbxPhoneNumberRule
  
  property :cnam_prefix
  property :distinctive_ring
  property :extension
  property :forward
  property :forward_destination
  property :id
  property :pbx_account_id
  property :pbx_location_id
  property :phonenumber

  validates :phonenumber, presence: true
  validates :forward_destination, presence: true, if: Proc.new { |p| p.forward == true }
  validates_inclusion_of :distinctive_ring, in: %w( Bellcore-dr1 Bellcore-dr2 Bellcore-dr3 Bellcore-dr4 Bellcore-dr5 )

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxPhoneNumber.from_source(response.parsed_response)
    end

  def self.load_from_json(json)
    PbxPhoneNumber.from_source(JSON.parse(json)).first
  end

  def self.get_distinctive_ring(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/ringtones"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.get_extensions(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/extensions"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.get_locations(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/locations"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def self.get_rule_actions(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/rule_actions"
    HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
  end

  def save(currentUser)
    requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
    HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
  end

  private

  def baseURL
    "/api/v1/portal_pbx_phone_numbers"
  end

  def getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

  def self.baseURL
    "/api/v1/portal_pbx_phone_numbers"
  end

  def self.getHeaders(token)
    encoded_token = JsonWebToken.encode(token)
    {"Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}"}
  end

end