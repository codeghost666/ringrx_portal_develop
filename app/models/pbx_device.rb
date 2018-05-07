class PbxDevice < RestModel
    include ActiveModel::Validations
    embeds_many :pbx_device_bindings, class_name: :pbx_device_binding

    property :id
    property :name
    property :pbx_account_id
    property :device_type
    property :macaddress
    property :pbx_user_id
    property :display_name
    property :signaling

    validates :name, presence: true
    validates :pbx_account_id, presence: true
    validates :device_type, presence: true
    validates :macaddress, presence: true
    validates_format_of :macaddress, :with => /\A([0-9A-Fa-f]{2}){6}\Z/i, :message => "MAC ADDRESS incorrect"
    validates :pbx_user_id, presence: true
    #validates_inclusion_of :device_type, in: %w( obihai-phone-1000 obihai-phone-2000 polycom-vvx )
    validates :device_type, :inclusion  => { :in => lambda { |d| d.class::MODELS.values } }
    validates :signaling, :inclusion  => { :in => lambda { |d| d.class::SIGNALING.values } }

    SIGNALING = {
  'UDP' => 'udp',
  'TCP' => 'tcp',
  'TLS' => 'tls'
}

MODELS = {
  'ObiHai Phone 1000' => 'obihai-phone-1000',
  'ObiHai Phone 1022' => 'obihai-phone-1022',
  'ObiHai Phone 2000' => 'obihai-phone-2000',
  'Polycom VVX' => 'polycom-vvx',
  'Yealink W52P/W56P' => 'yealink-w5xp',
  'ObiHai 300' => 'obihai-300',
  'ObiHai 302' => 'obihai-302',
}

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxDevice.from_source(response.parsed_response)
    end

    def self.load_by_device_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxDevice.from_source(response.parsed_response).first
    end

    def self.load_from_json(json)
        PbxDevice.from_source(JSON.parse(json)).first
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if id.nil?
            response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json(:except => "pbx_device_bindings"), :verify => false)            
        else
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
        end
        if response.code == 200 && id.nil?
            self.id = JSON.parse(response.body)['id'].to_s            
            unless pbx_device_bindings.nil?
                response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
                if response.code == 200
                    self.pbx_device_bindings = PbxDevice.load_by_device_id(currentUser, id).pbx_device_bindings
                end
            end
        end
        response
    end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    def self.delete_binding(currentUser, binding_id, device_id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{device_id}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => '{ "pbx_device_bindings": [ { "id": ' + binding_id.to_s + ', "_destroy": 1 } ]  }', :verify => false)
    end

    def self.device_types(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/device_types"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.device_signaling(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/device_signaling"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.binding_types(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/binding_types"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.binding_behaviors(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/binding_behaviors"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.pbx_users(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/pbx_users"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.pbx_parking_lots(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/pbx_parking_lots"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end
    def self.signaling(currentUser)
        {
            'udp' => 'UDP',
            'tcp' => 'TCP',
            'tls' => 'TLS'
        }
    end
    
    private 

    def baseURL
        "/api/v1/portal_pbx_devices"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_devices"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

end
