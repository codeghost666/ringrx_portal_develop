class PbxAuditLog < RestModel

    property :created_at
    property :event
    property :id
    property :ipaddress
    property :pbx_account_id
    property :role
    property :username

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxAuditLog.from_source(response.parsed_response)
    end
    
    private

    def self.baseURL
        "/api/v1/portal_pbx_audit_logs"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

end