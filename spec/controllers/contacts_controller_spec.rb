describe ContactsController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @parameters = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "#create|.load_by_id|#delete" do
        contact = Contact.new   
        it "should create a new contact" do
          json = JSON.parse('{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}')
          post '/contacts', :params => json.to_json, :headers => @parameters
          expect(response).to have_http_status(200)
          contact = Contact.load_from_json(@token, response.body)
          expect(contact).to be_a(Contact)
          expect(contact.id).not_to be_nil
        end
        it "should fetch that contact" do 
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(200)
          fetchContact = Contact.load_from_json(@token, response.body)
          expect(fetchContact).to be_a(Contact)
        end
        it "should delete the contact it created earlier" do
          delete "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(204)
        end
        it "should get a 404 when looking for the deleted contact" do
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(404)
        end
    end

    describe "#create|#update|#delete" do
        contact = Contact.new   
        it "should create a new contact" do
          json = JSON.parse('{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}')
          post '/contacts', :params => json.to_json, :headers => @parameters
          expect(response).to have_http_status(200)
          contact = Contact.load_from_json(@token, response.body)
          expect(contact).to be_a(Contact)
          expect(contact.id).not_to be_nil
        end
        it "should update that contact" do
            contact.email = "test@email.com"
            patch "/contacts/#{contact.id}", :params => contact.to_json, :headers => @parameters
            expect(response).to have_http_status(200)
        end
        it "should fetch that contact" do 
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(200)
          fetchContact = Contact.load_from_json(@token, response.body)
          expect(fetchContact).to be_a(Contact)
          expect(fetchContact.email).to eq(contact.email)
        end
        it "should delete the contact it created earlier" do
          delete "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(204)
        end
        it "should get a 404 when looking for the deleted contact" do
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(404)
        end
    end

    describe "#create|.load_by_user|#delete" do
        contact = Contact.new   
        it "should create a new contact" do
            json = JSON.parse('{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}')
            post '/contacts', :params => json.to_json, :headers => @parameters
            expect(response).to have_http_status(200)
            contact = Contact.load_from_json(@token, response.body)
            expect(contact).to be_a(Contact)
            expect(contact.id).not_to be_nil
        end
        it "should fetch that contact" do 
            get "/contacts", :headers => @parameters
            expect(response).to have_http_status(200)            
            contactsList = JSON.parse(response.body)
            expect(contactsList.find { |item| item['id'] == contact.id}).to_not be_nil
        end
        it "should delete the contact it created earlier" do
          delete "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(204)
        end
        it "should get a 404 when looking for the deleted contact" do
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(404)
        end
    end

    describe "#create|.load_by_domain|#delete" do
        contact = Contact.new   
        it "should create a new contact" do
            json = JSON.parse('{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"group","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}')
            post '/contacts', :params => json.to_json, :headers => @parameters
            expect(response).to have_http_status(200)
            contact = Contact.load_from_json(@token, response.body)
            expect(contact).to be_a(Contact)
            expect(contact.id).not_to be_nil
        end
        it "should fetch that contact" do 
            get "/contacts/domain", :headers => @parameters
            expect(response).to have_http_status(200)            
            contactsList = JSON.parse(response.body)
            expect(contactsList.find { |item| item['id'] == contact.id}).to_not be_nil
        end
        it "should delete the contact it created earlier" do
          delete "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(204)
        end
        it "should get a 404 when looking for the deleted contact" do
          get "/contacts/#{contact.id}", :headers => @parameters
          expect(response).to have_http_status(404)
        end
    end
end