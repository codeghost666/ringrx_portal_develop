class PbxMediaFile < RestModel
    include ActiveModel::Validations

    property :id
    property :pbx_account_id #Hidden
    property :uuid #Read Only
    property :name
    property :filename #Read Only
    property :mediafile
    property :mime_type #Read Only
    property :file_type #Read Only

    validates :name, presence: true
    validates :mediafile, presence: true, if: Proc.new { |p| p.id.nil? }
    validates :pbx_account_id, presence: true

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxMediaFile.from_source(response.parsed_response)
    end

    def self.load_from_json(json)
        PbxMediaFile.from_source(JSON.parse(json)).first
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if id.nil?
            response = RestClient::Request.execute(
                        method: :post,
                        url: requestURL,
                        payload: { mediafile: mediafile, name: name },
                        headers: {
                            'Content-Type' => "multipart/form-data",
                            Authorization: "Bearer #{JsonWebToken.encode(currentUser)}",
                            :Accept => "*/*"
                        },
                        verify_ssl: false
            )            
        else
            response = RestClient::Request.execute(
                        method: :put,
                        url: requestURL + "/#{id}",
                        payload: { mediafile: mediafile, name: name },
                        headers: {
                            'Content-Type' => "multipart/form-data",
                            Authorization: "Bearer #{JsonWebToken.encode(currentUser)}",
                            :Accept => "*/*"
                        },
                        verify_ssl: false
            )
        end
        if response.code == 200 && id.nil?
            self.id = JSON.parse(response.body)['id'].to_s
            self.uuid = JSON.parse(response.body)['uuid'].to_s
            self.mime_type = JSON.parse(response.body)['mime_type'].to_s
            self.file_type = JSON.parse(response.body)['file_type'].to_s
            self.filename = JSON.parse(response.body)['filename'].to_s
        end
        response
    end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    def self.get_media(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}/media"
        RestClient::Request.execute(
            method: :get,
            url: requestURL,
            headers: getHeaders(currentUser),
            verify_ssl: false
        )
    end

    private

    def baseURL
        "/api/v1/portal_pbx_media_files"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_media_files"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

end