class Contact < RestModel
    include ActiveModel::Validations

    embeds_many :telephone, class_name: :contact_telephone
    embeds_many :address, class_name: :contact_address

    property :domain
    property :user
    property :contact_type
    property :name
    property :org
    property :title
    property :photo
    property :email
    property :id, field: :_id
  
    validates :domain, :contact_type, presence: true
    validates :name, presence: true
    validates :user, format: { with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, on: :create }, presence: true
    validates_inclusion_of :contact_type, in: %w( private group )

    def self.get_number_types(currentUser)
      requestURL = "#{currentUser[:backend]}#{baseURL}/number_types"
      HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.get_address_types(currentUser)
      requestURL = "#{currentUser[:backend]}#{baseURL}/address_types"
      HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false).parsed_response.invert
    end

    def self.load_by_user(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/by_user"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)        
        Contact.from_source(response)
    end

    def self.load_by_domain(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/by_domain"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)
        Contact.from_source(response)
    end

    def self.load_by_id(currentUser, id)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        response = HTTParty.get(requestURL, :headers => getHeaders(currentUser), :verify => false)        
        if response.code != 200
            response
        else
            Contact.from_source(JSON.parse(response.body)).first
        end        
    end

    def self.load_from_json(currentUser, json)
        json_obj = JSON.parse(json)
        contact = Contact.from_source(json_obj).first
        if contact.domain.nil?
            contact.domain = currentUser[:domain]
        end
        if contact.user.nil?
            contact.user = currentUser[:username] + '@' + currentUser[:domain]
        end
        if contact.id.nil?
            contact.id = json_obj['id']
        end
        contact
    end

    def save(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}"
        if id.nil?
            response = HTTParty.post(requestURL, :headers => getHeaders(currentUser), :body => to_json, :verify => false)
        else
            response = HTTParty.put(requestURL + "/#{id}", :headers => getHeaders(currentUser), :body => to_json, :verify => false)
        end
        if response.code == 200 && id.nil?
            self.id = JSON.parse(response.body)['_id']
        end
        response
    end

    def delete(currentUser)
        requestURL = "#{currentUser[:backend]}#{baseURL}/#{id}"
        HTTParty.delete(requestURL, :headers => getHeaders(currentUser), :verify => false)
    end

    private 

    def baseURL
        "/api/v1/portal_contacts"
    end

    def getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

    def self.baseURL
        "/api/v1/portal_contacts"
    end

    def self.getHeaders(token)
        encoded_token = JsonWebToken.encode(token)
        { "Content-Type" => 'application/json', "Authorization" => "Bearer #{encoded_token}" }
    end

  end
