class JsonWebToken    
    def self.encode(payload)
      sharedSecret = '64358a53c2427d7991dee6f243f5fad3441842c9b20f364c944bb57545a667c946dcab25b0b3aeee0156635c7604fb3f6dfb4175b1d18115877a1651826f9627'
      JWT.encode(payload, sharedSecret)
    end
  
    def self.decode(token)      
      sharedSecret = '64358a53c2427d7991dee6f243f5fad3441842c9b20f364c944bb57545a667c946dcab25b0b3aeee0156635c7604fb3f6dfb4175b1d18115877a1651826f9627'
      return HashWithIndifferentAccess.new(JWT.decode(token, sharedSecret)[0])
      #return HashWithIndifferentAccess.new(JWT.decode(token, Rails.application.secrets.secret_key_base)[0])
    rescue
      nil
    end
end