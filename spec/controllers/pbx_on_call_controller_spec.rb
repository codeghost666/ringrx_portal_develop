describe PbxOnCallController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxoncalls | #get_by_user" do
        it "should fetch the PBX On Call Lot List" do
          get '/pbxoncalls', :headers => @headers
          expect(response).to have_http_status(200)
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_object = PbxOnCall.new
        it "should save the On Call to the backend" do
            json = '{"pbx_account_id":1,"name":"OnCall_999","extension":"999","greeting":"","moh":"miami_viceroy.mp3","mailbox":"OnCall_999@test.ringrx.com","record_calls":false,"retries":3,"minutes":5,"callerid":"8183039450","created_at":"2018-02-07T02:55:48.000Z","updated_at":"2018-02-07T03:00:00.000Z","shift_alarm":"ryan@ringrx.com","shift_alarm_suppress":"2018-02-07T04:00:00.000Z","shift_alarm_minutes":60}'
            my_object = PbxOnCall.load_from_json(json)
            expect(my_object).to be_a(PbxOnCall)
            expect(my_object.id).to be_nil

            post '/pbxoncalls', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object = PbxOnCall.load_from_json(response.body)
            expect(my_object.pbx_oncall_shifts.count).to eq(0)
        end
        it "should return the current PbxOnCall collection" do
            get '/pbxoncalls', :headers => @headers
            expect(response).to have_http_status(200)  
            fetch_object = PbxOnCall.from_source(JSON.parse(response.body)).find_all { |obj| obj.id.to_s == my_object.id.to_s}.first
            expect(fetch_object).not_to be_nil
            expect(fetch_object).to be_a(PbxOnCall)            
        end
        it "should update fields to the backend server" do
            my_object.name = "Updated_Name"
            patch '/pbxoncalls', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object = PbxOnCall.load_from_json(response.body)            
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxoncalls', :headers => @headers
            expect(response).to have_http_status(200)
            updated_object = PbxOnCall.from_source(JSON.parse(response.body)).find_all { |obj| obj.id.to_s == my_object.id.to_s}.first
            expect(updated_object).to be_a(PbxOnCall)
            expect(updated_object).not_to be_nil
            expect(updated_object.name).to eq(my_object.name)
        end
        added_object = PbxOnCallShift.new
        it "should add a shift" do
            shift_to_add = JSON.parse("{\"pbx_on_call_shift\":{\"day_fri\":false,\"day_mon\":false,\"day_sat\":false,\"day_sun\":false,\"day_thu\":false,\"day_tue\":false,\"day_wed\":false,\"metric\":false,\"name\":\"Shift number 1\",\"priority\":167,\"start_at\":\"2018-02-27T04:00:00+03:00\",\"end_at\":\"2018-02-27T11:00:00+03:00\",\"pbxOnCall\":null,\"pbx_oncall_shift_users\":[{\"pbx_user_id\":7,\"priority\":1,\"pbxOncallShift\":null},{\"pbx_user_id\":5,\"priority\":2,\"pbxOncallShift\":null}]}}")
            post "/pbxoncalls/#{my_object.id}/shifts", :params => shift_to_add.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            added_object = PbxOnCallShift.from_source(JSON.parse(response.body)).first
            expect(added_object).to be_a(PbxOnCallShift)
            expect(added_object).not_to be_nil
        end
        it "should update a shift" do
            added_object.name = "Updated_Name"
            patch "/pbxoncalls/#{my_object.id}/shifts", :params => JSON.parse("{ \"pbx_on_call_shift\" : " + added_object.to_json + " }").to_json, :headers => @headers            
            expect(response).to have_http_status(200)
            updated_object = PbxOnCallShift.from_source(JSON.parse(response.body)).first
            expect(updated_object).to be_a(PbxOnCallShift)
            expect(updated_object).not_to be_nil
            expect(updated_object.name).to eq(added_object.name)
        end
        it "should delete a user from a shift" do
            get '/pbxoncalls', :headers => @headers
            expect(response).to have_http_status(200)  
            my_object = PbxOnCall.from_source(JSON.parse(response.body)).find_all { |obj| obj.id.to_s == my_object.id.to_s}.first
            delete "/pbxoncalls/#{my_object.id}/shifts/#{my_object.pbx_oncall_shifts.first.id}/#{my_object.pbx_oncall_shifts.first.pbx_oncall_shift_users.first.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
        it "should delete a shift" do
            delete "/pbxoncalls/#{my_object.id}/shifts/#{my_object.pbx_oncall_shifts.first.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
        it "should delete the created object" do
            delete "/pbxoncalls/#{my_object.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
    end

    describe ".moh" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/moh', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".mediafiles" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/mediafiles', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".mailboxes" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/mailboxes', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".phonenumbers" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/phonenumbers', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".pbx_users" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/pbx_users', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".new" do
        it "should return a JSON collection" do          
            get '/pbxoncalls/new', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

end