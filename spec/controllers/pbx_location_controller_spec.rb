describe PbxLocationController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxlocations | #get_by_user" do
        it "should fetch the PBX Locations List" do
          get '/pbxlocations', :headers => @headers
          expect(response).to have_http_status(200)          
          loc = PbxLocation.load_from_json(JSON.parse(response.body).first.to_json)
          expect(loc).to be_a(PbxLocation)
          expect(loc.id).not_to be_nil
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_location = PbxLocation.new
        it "should save the PbxLocation to the backend" do
            json = '{"pbx_account_id":1,"name":"Home","address":"9727 Wheatland Ave","city":"Sunland","state":"Ca","zip":"91342","emergency":null,"created_at":"2017-07-25T17:32:18.000Z","updated_at":"2017-07-25T17:32:18.000Z"}'
            my_location = PbxLocation.load_from_json(json)
            expect(my_location).to be_a(PbxLocation)
            expect(my_location.id).to be_nil

            post '/pbxlocations', :params => my_location.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_location.id = JSON.parse(response.body)['id']
        end
        it "should return the current PbxLocation collection" do
            get '/pbxlocations', :headers => @headers
            expect(response).to have_http_status(200)
            locs = PbxLocation.from_source(JSON.parse(response.body))
            fetch_loc = locs.find_all { |loc| loc.id == my_location.id.to_s}.first
            expect(fetch_loc).to be_a(PbxLocation)
            expect(fetch_loc).not_to be_nil
        end
        it "should update fields to the backend server" do
            if my_location.name == "test_update_a"
                my_location.name = "test_update_b"
            else
                my_location.name = "test_update_a"
            end
            patch '/pbxlocations', :params => my_location.to_json, :headers => @headers
            expect(response).to have_http_status(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxlocations', :headers => @headers
            expect(response).to have_http_status(200)
            locs = PbxLocation.from_source(JSON.parse(response.body))
            fetch_loc = locs.find_all { |loc| loc.id == my_location.id.to_s}.first
            expect(fetch_loc).to be_a(PbxLocation)
            expect(fetch_loc).not_to be_nil
            expect(fetch_loc.name).to eq(my_location.name)
        end
        it "should delete the created location" do
            delete "/pbxlocations/#{my_location.id}", :headers => @headers
            expect(response).to have_http_status(204)            
        end
    end
end