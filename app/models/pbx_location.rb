class PbxLocation < RestModel
    include ActiveModel::Validations

    property :pbx_account_id
    property :name
    property :address
    property :city
    property :state
    property :zip
    property :id

    validates :pbx_account_id, presence: true
    validates :name, presence: true
    validates :address, presence: true
    validates :city, presence: true
    validates :state, presence: true
    validates_format_of :zip, :with => /\A\d{5}-\d{4}|\A\d{5}\z/, :message => "should be in the form 12345 or 12345-1234", presence: true

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        if response.code !=200
            []
        else
            PbxLocation.from_source(response.parsed_response)
        end
    end

    def self.load_from_json(json)
        PbxLocation.from_source(JSON.parse(json)).first
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

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end
    
    private 

    def baseURL
        "/api/v1/portal_pbx_locations"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_locations"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end
end