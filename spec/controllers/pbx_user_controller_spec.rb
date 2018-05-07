describe PbxUserController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxusers | #get_by_user" do
        it "should fetch the PBX Users List" do
          get '/pbxusers', :headers => @headers
          expect(response).to have_http_status(200)          
          user = PbxUser.load_from_json(JSON.parse(response.body).first.to_json)
          expect(user).to be_a(PbxUser)
          expect(user.id).not_to be_nil
        end
    end

    describe "PATCH /pbxusers | #update" do
        my_user = PbxUser.new
        it "should fetch the PBX Users List" do
            get '/pbxusers', :headers => @headers
            expect(response).to have_http_status(200)
            users = PbxUser.from_source(JSON.parse(response.body))
            my_user = users.find_all { |user| user.username ==  @token[:username]}.first
            expect(my_user).to be_a(PbxUser)
            expect(my_user.id).not_to be_nil
        end
        it "should update a PBX User object and save it" do
            if my_user.email == "test_a@email.com"
                my_user.email = "test_b@email.com"
            else
                my_user.email = "test_a@email.com"
            end
            patch '/pbxusers', :params => my_user.to_json, :headers => @headers
            expect(response).to have_http_status(200)
        end
        it "should re-fetch that PBX User object and validate the object was updated" do
            get '/pbxusers', :headers => @headers
            expect(response).to have_http_status(200)
            users = PbxUser.from_source(JSON.parse(response.body))
            my_user2 = users.find_all { |user| user.username ==  @token[:username]}.first
            expect(my_user2).to be_a(PbxUser)
            expect(my_user2.email).to eq(my_user.email)
        end
    end

    describe "POST & DELETE /pbxusers | #create #delete" do
        id = -1
        it "should create a new PBX User object and save it" do
            json = '{"pbx_account_id":1,"name":"Unit Test","extension":"999","username":"unit_test","sip_password":"VzTZzpIc1o5zzhDPEqQ","pin":"41668","max_bindings":1,"external_callerid_name":"","external_callerid_number":"","email":"unit_test@unit.com","mobile":"","call_timeout":24,"forward_behavior":"endpoint","pbx_location_id":1,"mailbox":"unit_test@test.ringrx.com","vm_email_content":"","vm_email_notification":"","fax_ext":"","enable_mobile_stun":false,"oncall_remind_minutes":60,"oncall_remind_email":false,"oncall_remind_sms":false,"sms_enable":false,"role":"user"}'
            my_user = PbxUser.load_from_json(json)
            post '/pbxusers', :params => my_user.to_json, :headers => @headers
            expect(response).to have_http_status(201)
            id = JSON.parse(response.body)['id']
        end
        it "should display the new user in the GET users" do
            get '/pbxusers', :headers => @headers
            expect(response).to have_http_status(200)
            users = PbxUser.from_source(JSON.parse(response.body))
            fetch_user = users.find_all { |user| user.id == id.to_s}.first
            expect(fetch_user).to be_a(PbxUser)
            expect(fetch_user).not_to be_nil
        end
        it "should delete the newly created user" do
            delete "/pbxusers/#{id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
        it "should display the new user in the GET users" do
            get '/pbxusers', :headers => @headers
            expect(response).to have_http_status(200)
            users = PbxUser.from_source(JSON.parse(response.body))
            check_delete_user = users.find_all { |user| user.id ==  id.to_s}.first
            expect(check_delete_user).to be_nil
        end
    end

end