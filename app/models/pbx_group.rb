class PbxGroup < RestModel
    include ActiveModel::Validations

    embeds_many :pbx_group_users, class_name: :pbx_group_user

    property :id
    property :call_timeout
    property :cnam_prefix
    property :distinctive_ring
    property :extension
    property :mailbox
    property :name
    property :pbx_account_id        
    property :sequential            

    validates :name, presence: true
    validates :pbx_account_id, presence: true
    validates :call_timeout, numericality: { less_than_or_equal_to: 100 }, presence: true
    validates :distinctive_ring, :inclusion  => { :in => lambda { |g| g.class::RINGTONE.values } }, allow_blank: true

    RINGTONE = {
  'Bellcore-dr1' => 'Bellcore-dr1',
  'Bellcore-dr2' => 'Bellcore-dr2',
  'Bellcore-dr3' => 'Bellcore-dr3',
  'Bellcore-dr4' => 'Bellcore-dr4',
  'Bellcore-dr5' => 'Bellcore-dr5'
}


    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxGroup.from_source(response)
    end

    def self.load_by_group_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        PbxGroup.from_source(response.parsed_response).first
    end

    def self.load_from_json(json)
        PbxGroup.from_source(JSON.parse(json)).first
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if id.nil?
            response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json(:except => "pbx_group_users"), :verify => false)
        else
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
        end
        if response.code == 200 && id.nil?
            self.id = JSON.parse(response.body)['id'].to_s
            self.extension = JSON.parse(response.body)['extension'].to_s
            unless pbx_group_users.nil?
                response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
                if response.code == 200
                    self.pbx_group_users = PbxGroup.load_by_group_id(currentUser, id).pbx_group_users
                end
            end
        end        
        response
    end

    def self.delete(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    def self.delete_group_user(currentUser, group_id, user_id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{group_id}"
        HTTParty.put(requestURL, :headers => getHeaders(currentUser), :body => '{ "pbx_group_users": [ { "id": ' + user_id.to_s + ', "_destroy": 1 } ]  }', :verify => false)
    end

    def self.ringtones(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/ringtones"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.mailboxes(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/mailboxes"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.pbx_users(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/pbx_users"
        HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end    
    
    private 

    def baseURL
        "/api/v1/portal_pbx_groups"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_pbx_groups"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end
    
end