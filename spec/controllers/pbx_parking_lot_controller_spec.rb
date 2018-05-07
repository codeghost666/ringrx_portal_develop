describe PbxParkingLotController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxparkinglots | #get_by_user" do
        it "should fetch the PBX Parking Lot List" do
          get '/pbxparkinglots', :headers => @headers
          expect(response).to have_http_status(200)
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_object = PbxParkingLot.new
        it "should save the Parking Lot to the backend" do
            json = '{"pbx_account_id":1,"extension":"999","moh":"nowhere_land.mp3","timeout":0,"timeout_extension":"1001","created_at":"2017-07-25T17:34:58.000Z","updated_at":"2017-07-25T17:34:58.000Z"}'
            my_object = PbxParkingLot.load_from_json(json)
            expect(my_object).to be_a(PbxParkingLot)
            expect(my_object.id).to be_nil

            post '/pbxparkinglots', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object.id = JSON.parse(response.body)['id']
        end
        it "should return the current PbxParkingLot collection" do
            get '/pbxparkinglots', :headers => @headers
            expect(response).to have_http_status(200)  
            fetch_object = PbxParkingLot.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(fetch_object).not_to be_nil
            expect(fetch_object).to be_a(PbxParkingLot)            
        end
        it "should update fields to the backend server" do
            my_object.extension = "998"
            patch '/pbxparkinglots', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object = PbxParkingLot.load_from_json(response.body)            
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxparkinglots', :headers => @headers
            expect(response).to have_http_status(200)
            updated_object = PbxParkingLot.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(updated_object).to be_a(PbxParkingLot)
            expect(updated_object).not_to be_nil
            expect(updated_object.extension).to eq(my_object.extension)
        end
        it "should delete the created object" do
            delete "/pbxparkinglots/#{my_object.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
    end

    describe ".extensions" do
        it "should return a JSON collection" do          
            get '/pbxparkinglots/extensions', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".moh" do
        it "should return a JSON collection" do          
            get '/pbxparkinglots/moh', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

end