class PbxOnCall < RestModel
    include ActiveModel::Validations

    embeds_many :pbx_oncall_shifts, class_name: :pbx_on_call_shift

    property :callerid
    property :extension
    property :greeting
    property :id
    property :mailbox
    property :minutes, type: Integer
    property :moh
    property :name
    property :pbx_account_id
    property :record_calls
    property :retries, type: Integer
    property :shift_alarm
    property :shift_alarm_minutes, type: Integer
    property :shift_alarm_supress

    validates :name, presence: true
    validates_inclusion_of :retries, :in => 1..100
    validates_inclusion_of :minutes, :in => 3..600
    validates :callerid, presence: true
    validates :pbx_account_id, presence: true
    validates_inclusion_of :shift_alarm_minutes, :in => 15..600

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        if response.code !=200
            []
        else
            PbxOnCall.from_source(response.parsed_response)
        end
    end

    def self.load_by_oncall_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxOnCall.from_source(response.parsed_response).first
    end

    def self.load_from_json(json)
        PbxOnCall.from_source(JSON.parse(json)).first
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        self.pbx_oncall_shifts.each do |shift|
            shift.priority = shift.priority.to_i + 1000
        end
        if id.nil?
            response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json(:except => "pbx_oncall_shift_users"), :verify => false)
        else
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json(:except => "pbx_oncall_shift_users"), :verify => false)
        end
        if response.code == 200
            response_obj = PbxOnCall.from_source(JSON.parse(response.body)).first
            self.id = response_obj.id
            self.pbx_oncall_shifts.each do |shift|
                shift.pbx_oncall_id = response_obj.id
                shift.id = response_obj.pbx_oncall_shifts.find_all { |obj| obj.name == shift.name }.first.id
                shift.priority = shift.priority.to_i - 1000
            end
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)            
            if response.code == 200
                self.pbx_oncall_shifts = PbxOnCall.load_by_oncall_id(currentUser, id).pbx_oncall_shifts 
            end
        end
        response
    end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    def self.delete_shift(currentUser, on_call_id, shift_id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{on_call_id}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => '{ "pbx_oncall_shifts": [ { "id": ' + shift_id.to_s + ', "_destroy": 1 } ]  }', :verify => false)
    end

    def self.delete_user_from_shift(currentUser, on_call_id, shift_id, user_id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{on_call_id}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => '{ "pbx_oncall_shifts": [ { "id": ' + shift_id.to_s + ', "pbx_oncall_shift_users": [ { "id": ' + user_id.to_s + ', "_destroy": 1 } ] } ]  }', :verify => false)
    end

    def self.moh(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/moh"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.mediafiles(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/mediafiles"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.mailboxes(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/mailboxes"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.phonenumbers(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/phonenumbers"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.pbx_users(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/pbx_users"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_new(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/new"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    private 

    def baseURL
        "/api/v1/portal_pbx_oncalls"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_oncalls"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

end