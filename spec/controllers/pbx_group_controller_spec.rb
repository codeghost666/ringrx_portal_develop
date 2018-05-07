describe PbxGroupController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "GET /pbxgroups | #get_by_user" do
        it "should fetch the PBX Group List" do
          get '/pbxgroups', :headers => @headers
          expect(response).to have_http_status(200)
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_object = PbxGroup.new
        it "should save the PbxGroup to the backend" do
            json = '{"pbx_account_id":1,"name":"Test Group","sequential":false,"cnam_prefix":"","created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","call_timeout":24,"mailbox":"","pbx_group_users":[{"pbx_user_id":60,"priority":1,"created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","pbx_user":{"name":"Damon"}}]}'
            my_object = PbxGroup.load_from_json(json)
            expect(my_object).to be_a(PbxGroup)
            expect(my_object.id).to be_nil

            post '/pbxgroups', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object.id = JSON.parse(response.body)['id']
        end
        it "should return the current PbxGroup collection" do
            get '/pbxgroups', :headers => @headers
            expect(response).to have_http_status(200)            
            fetch_object = PbxGroup.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(fetch_object).not_to be_nil
            expect(fetch_object).to be_a(PbxGroup)            
        end
        it "should update fields to the backend server" do
            my_object.name = "test_update_a"
            new_group_user = PbxGroupUser.new
            new_group_user.pbx_user_id = 6
            my_object.pbx_group_users = Array.new
            my_object.pbx_group_users.push(new_group_user)            
            patch '/pbxgroups', :params => my_object.to_json, :headers => @headers
            expect(response).to have_http_status(200)
            my_object = PbxGroup.load_from_json(response.body)            
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxgroups', :headers => @headers
            expect(response).to have_http_status(200)
            updated_object = PbxGroup.from_source(JSON.parse(response.body)).find_all { |obj| obj.id == my_object.id.to_s}.first
            expect(updated_object).to be_a(PbxGroup)
            expect(updated_object).not_to be_nil
            expect(updated_object.name).to eq(my_object.name)
            expect(updated_object.pbx_group_users.count).to eq(my_object.pbx_group_users.count)
        end
        it "should delete a user from the group" do
            delete "/pbxgroups/#{my_object.id}/user/#{my_object.pbx_group_users.first.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
        it "should delete the created object" do
            delete "/pbxgroups/#{my_object.id}", :headers => @headers
            expect(response).to have_http_status(204)
        end
    end

    describe ".ringtones" do
        it "should return a JSON collection" do          
            get '/pbxgroups/ringtones', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".mailboxes" do
        it "should return a JSON collection" do          
            get '/pbxgroups/mailboxes', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

    describe ".pbx_users" do
        it "should return a JSON collection" do          
            get '/pbxdevices/pbx_users', :headers => @headers
            expect(response).to have_http_status(200)
        end
    end

end