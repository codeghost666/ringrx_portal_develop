describe PbxUser do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxUser object" do
          json = '{"id":19,"pbx_account_id":1,"name":"Damon Prater","extension":"","username":"unit_test_2","sip_password":"VzTZzpCIcWo5VzhrPEWQ","auth_token":"sp5CC0wEQGPTZ5dqzK7P9Ud7FOeWJC4Z","pin":"41668","max_bindings":null,"external_callerid_name":"","external_callerid_number":"","email":"damon@inxaos.com","mobile":"","call_timeout":24,"forward_behavior":"endpoint","created_at":"2017-10-25T04:26:12.000Z","updated_at":"2018-01-20T22:23:53.000Z","pbx_location_id":1,"mailbox":"damon@test.ringrx.com","vm_email_content":"","vm_email_notification":"damon2@test.com","fax_ext":"","enable_mobile_stun":false,"oncall_remind_minutes":60,"oncall_remind_email":false,"oncall_remind_sms":false,"sms_enable":false,"role":"admin","pbx_mailbox_users":[],"pbx_user_schedules":[]}'
          my_user = PbxUser.load_from_json(json)
          expect(my_user).to be_a(PbxUser)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxUser collection" do          
            users = PbxUser.load_by_user(@currentUser)
            expect(users).not_to be_nil
            expect(users.count).to be > 1
            my_user = users.find_all { |user| user.username ==  @currentUser[:username]}.first
            expect(my_user.username).to eq(@currentUser[:username])
        end
    end

    describe ".get_forward_behaviors" do
        it "should return a JSON object of Forward Behaviors" do          
            my_user = PbxUser.get_forward_behaviors(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".get_oncall_behaviors" do
        it "should return a JSON object of On Call Behaviors" do          
            my_user = PbxUser.get_oncall_behaviors(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".mailboxes" do
        it "should return a JSON object of Mailboxes" do          
            my_user = PbxUser.mailboxes(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".roles" do
        it "should return a JSON object of Roles" do          
            my_user = PbxUser.roles(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".locations" do
        it "should return a JSON object of Locations" do          
            my_user = PbxUser.locations(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".fax_extensions" do
        it "should return a JSON object of Fax Extension" do          
            my_user = PbxUser.fax_extensions(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".load_by_user_id" do        
        it "should get a PbxUser when trying to load a valid user id" do
            users = PbxUser.load_by_user(@currentUser)
            loaded_user = PbxUser.load_by_user_id(@currentUser, users.first.id)
            expect(loaded_user).to be_a(PbxUser)
        end
        it "should get a 404 when trying to load an invalid user id" do
            response = PbxUser.load_by_user_id(@currentUser, -1)
            expect(response.code).to eq(404)
        end
    end

    describe "#delete|create_user|delete_user" do        
        my_user = PbxUser.new
        it "should create a new PbxUser object" do
            json = '{"pbx_account_id":1,"name":"Unit Test","extension":"","username":"unit_test","sip_password":"VzTZzpIc1o5zzhDPEqQ","pin":"41668","max_bindings":1,"external_callerid_name":"","external_callerid_number":"","email":"unit_test@unit.com","mobile":"","call_timeout":24,"forward_behavior":"endpoint","pbx_location_id":1,"mailbox":"unit_test@test.ringrx.com","vm_email_content":"","vm_email_notification":"","fax_ext":"","enable_mobile_stun":false,"oncall_remind_minutes":60,"oncall_remind_email":false,"oncall_remind_sms":false,"sms_enable":false,"role":"user"}'
            my_user = PbxUser.load_from_json(json)
            expect(my_user).not_to be_nil
            expect(my_user).to be_a(PbxUser)
        end
        it "should save and get an id back" do            
            response = my_user.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_user.id).not_to be_nil
        end
        it "should delete the created user" do
            response = PbxUser.delete(@currentUser, my_user.id)
            expect(response.code).to eq(204)
        end
        it "should get a 404 when trying to load the user id" do
            response = PbxUser.load_by_user_id(@currentUser, my_user.id)
            expect(response.code).to eq(404)
        end
    end

    describe "#save|update_user" do        
        my_user = PbxUser.new
        it "should return the current PbxUser object" do
            my_user = PbxUser.load_by_user(@currentUser).find_all { |user| user.username ==  @currentUser[:username]}.first
            expect(my_user).not_to be_nil
            expect(my_user).to be_a(PbxUser)
            expect(my_user.username).to eq(@currentUser[:username])
            expect(my_user.id).not_to be > 0
        end
        it "should update fields to the backend server" do
            if my_user.email == "test_a@email.com"
                my_user.email = "test_b@email.com"
            else
                my_user.email = "test_a@email.com"
            end
            response = my_user.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            #skip "Issue raised with Ryan D against the engine"
            my_user2 = PbxUser.load_by_user(@currentUser).find_all { |user| user.username ==  @currentUser[:username]}.first
            expect(my_user2).not_to be_nil
            expect(my_user2).to be_a(PbxUser)
            expect(my_user2.username).to eq(@currentUser[:username])
            expect(my_user2.email).to eq(my_user.email)
        end
    end
end