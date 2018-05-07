describe PbxFaxController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxfaxes | #get_by_user" do
        it "should fetch the PBX Fax List" do
          get '/pbxfaxes', :headers => @headers
          expect(response).to have_http_status(200)          
          loc = PbxFax.load_from_json(JSON.parse(response.body).first.to_json)
          expect(loc).to be_a(PbxFax)
          expect(loc.id).not_to be_nil
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_fax = PbxFax.new
        it "should save the PbxFax to the backend" do
            json = '{"pbx_account_id":1,"name":"Unit Test","extension":"301","default_callerid":"8183039450","default_format":"pdf","destination_type":"email","destination_email":"","destination_mailbox":"rdelgrosso@test.ringrx.com","notification_email":"","notify_failure":false}'
            my_fax = PbxFax.load_from_json(json)
            expect(my_fax).to be_a(PbxFax)
            expect(my_fax.id).to be_nil

            post '/pbxfaxes', :params => my_fax.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_fax.id = JSON.parse(response.body)['id']
        end
        it "should return the current PbxFax collection" do
            get '/pbxfaxes', :headers => @headers
            expect(response).to have_http_status(200)
            faxes = PbxFax.from_source(JSON.parse(response.body))
            fetch_fax = faxes.find_all { |fax| fax.id == my_fax.id.to_s}.first
            expect(fetch_fax).to be_a(PbxFax)
            expect(fetch_fax).not_to be_nil
        end
        it "should update fields to the backend server" do
            if my_fax.name == "test_update_a"
                my_fax.name = "test_update_b"
            else
                my_fax.name = "test_update_a"
            end
            patch '/pbxfaxes', :params => my_fax.to_json, :headers => @headers
            expect(response).to have_http_status(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxfaxes', :headers => @headers
            expect(response).to have_http_status(200)
            faxes = PbxFax.from_source(JSON.parse(response.body))
            fetch_fax = faxes.find_all { |fax| fax.id == my_fax.id.to_s}.first
            expect(fetch_fax).to be_a(PbxFax)
            expect(fetch_fax).not_to be_nil
            expect(fetch_fax.name).to eq(my_fax.name)
        end
        it "should delete the created location" do
            delete "/pbxfaxes/#{my_fax.id}", :headers => @headers
            expect(response).to have_http_status(204)            
        end
    end

    describe ".get_phonenumbers" do
        it "should return a JSON object of Phone Numbers" do          
            get '/pbxfaxes/phonenumbers', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".get_formats" do
        it "should return a JSON object of Fax Formats" do          
            get '/pbxfaxes/formats', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".get_destination_types" do
        it "should return a JSON object of Destination Types" do          
            get '/pbxfaxes/destination_types', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".get_mailboxes" do
        it "should return a JSON object of Mailboxes" do          
            get '/pbxfaxes/mailboxes', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end
end