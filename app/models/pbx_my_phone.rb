class PbxMyPhone < RestModel
    include ActiveModel::Validations

    embeds_many :pbx_user_schedules, class_name: :pbx_user_schedule

    property :name # Display Only
    property :extension # Display Only
    property :username # Display Only
    property :password # This will never come back, but should be in the model
    property :pin
    property :external_callerid_name # Display Only
    property :external_callerid_number # Display Only
    property :email
    property :mobile
    property :call_timeout
    property :forward_behavior
    property :vm_email_notification
    property :vm_email_content
    property :fax_ext # Display Only
    property :enable_mobile_stun
    property :oncall_remind_minutes
    property :oncall_remind_email
	  property :oncall_remind_sms
    property :id

    validates :forward_behavior, :inclusion  => { :in => lambda { |u| u.class::FORWARD.values } }
    validates :call_timeout, numericality: { less_than_or_equal_to: 100 }, presence: true
    validates :pin, presence: true, length: { minimum: 4, maximum: 9 }

FORWARD = {
  'Ring My Phone' => 'endpoint',
  'Simultaneous Ring' => 'simring',
  'Sequential' => 'sequential',
  'Forward' => 'forward'
}

    def self.load_by_account_id(currentUser)
    end

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxMyPhone.from_source(response.parsed_response).first
    end

    def self.load_from_json(json)
        PbxMyPhone.from_source(JSON.parse(json)).first
    end

    def self.get_forward_behaviors(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/forwardbehaviors"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_oncall_behaviors(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/oncallbehaviors"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
    end

    def self.delete_schedule(currentUser, schedule_id)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => '{ "pbx_user_schedules": [ { "id": ' + schedule_id.to_s + ', "_destroy": 1 } ]  }', :verify => false)
    end


    private 

    def baseURL
        "/api/v1/portal_my_phone"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_my_phone"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

end
