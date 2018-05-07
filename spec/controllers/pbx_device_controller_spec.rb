describe PbxDeviceController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxdevices | #get_by_user" do
        it "should fetch the PBX Device List" do
          get '/pbxdevices', :headers => @headers
          expect(response).to have_http_status(200)
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_object = PbxDevice.new
        it "should save the PbxDevice to the backend" do
            json = '{"name":"Test Device 1","signaling": "tcp","pbx_account_id":1,"device_type":"obihai-phone-1000","macaddress":"FFFFFFFFFFFF","pbx_user_id":60,"display_name":"Sample Device","shared":null,"created_at":"2018-01-28T22:22:27.000Z","updated_at":"2018-01-28T22:22:27.000Z","pbx_device_bindings":[{"binding_index":1,"binding_type":"line","binding_behavior":"line","binding_display":"Display Field","binding_argument":"Argument Field","pbx_user_id":60,"created_at":"2018-01-28T22:23:23.000Z","updated_at":"2018-01-28T22:23:23.000Z"}]}'
            my_object = PbxDevice.load_from_json(json)
            expect(my_object).to be_a(PbxDevice)
            expect(my_object.id).to be_nil

            post '/pbxdevices', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object.id = JSON.parse(response.body)['id']
        end
        it "should return the current PbxDevice collection" do
            get '/pbxdevices', :headers => @headers
            expect(response).to have_http_status(200)
            fetch_object = PbxDevice.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(fetch_object).to be_a(PbxDevice)
            expect(fetch_object).not_to be_nil
        end
        it "should update fields to the backend server" do
            my_object.name = "test_update_a"
            my_object.macaddress = "AAFFFFFFFFFF"
            patch '/pbxdevices', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxdevices', :headers => @headers
            expect(response).to have_http_status(200)
            updated_object = PbxDevice.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(updated_object).to be_a(PbxDevice)
            expect(updated_object).not_to be_nil
            expect(updated_object.name).to eq(my_object.name)
            expect(updated_object.macaddress).to eq(my_object.macaddress)
        end
        it "should delete the created object" do
            delete "/pbxdevices/#{my_object.id}", :headers => @headers
            expect(response).to have_http_status(204)            
        end
    end

    describe ".device_types" do
        it "should return a JSON collection" do          
            get '/pbxdevices/device_types', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".binding_types" do
        it "should return a JSON collection" do          
            get '/pbxdevices/binding_types', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".binding_behaviors" do
        it "should return a JSON collection" do          
            get '/pbxdevices/binding_behaviors', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".pbx_users" do
        it "should return a JSON collection" do          
            get '/pbxdevices/pbx_users', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".pbx_parking_lots" do
        it "should return a JSON collection" do          
            get '/pbxdevices/pbx_parking_lots', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end
end