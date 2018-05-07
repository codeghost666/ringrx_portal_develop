class PbxFax < RestModel
    include ActiveModel::Validations

    property :id
    property :pbx_account_id
    property :name
    property :extension
    property :default_callerid
    property :default_format
    property :destination_type
    property :destination_email
    property :destination_mailbox
    property :notification_email
    property :notify_failure

    validates :name, presence: true
    #validates :pbx_account_id, presence: true
    validates :extension, presence: true
    validates :default_callerid, presence: true
    validates :destination_type, presence: true
    validates :destination_mailbox, presence: true
    validates_inclusion_of :destination_type, in: %w( mailbox email email_and_mailbox )
    validates_inclusion_of :default_format, in: %w( pdf tif )

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxFax.from_source(response.parsed_response)
    end

    def self.load_by_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxFax.from_source(response.parsed_response).first
    end

    def self.load_from_json(json)
        PbxFax.from_source(JSON.parse(json)).first
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if id.nil?            
            response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)            
            
        else
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
        end
        if response.code == 200 && id.nil?
            parsedResponse = JSON.parse(response.body)
            self.id = parsedResponse['id'].to_s
            self.extension = parsedResponse['extension'].to_s
            self.name = parsedResponse['name'].to_s
        end
        response
    end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    def self.get_phonenumbers(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/phonenumbers"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_formats(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/formats"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_destination_types(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/destination_types"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_mailboxes(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/mailboxes"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    private 

    def baseURL
        "/api/v1/portal_pbx_faxes"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_faxes"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end



end