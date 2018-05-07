describe PbxMyPhone do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxMyPhone object" do
          json = '{"id":19,"pbx_account_id":1,"name":"Damon Prater","extension":"812","username":"damon","sip_password":"VzTZzpCIcWo5VzhrPEWQ","auth_token":"sp5CC0wEQGPTZ5dqzK7P9Ud7FOeWJC4Z","pin":"41668","max_bindings":null,"external_callerid_name":"","external_callerid_number":"","email":"damon@inxaos.com","mobile":"","call_timeout":24,"forward_behavior":"endpoint","created_at":"2017-10-25T04:26:12.000Z","updated_at":"2018-01-20T22:23:53.000Z","pbx_location_id":1,"mailbox":"damon@test.ringrx.com","vm_email_content":"","vm_email_notification":"damon2@test.com","fax_ext":"","enable_mobile_stun":false,"oncall_remind_minutes":60,"oncall_remind_email":false,"oncall_remind_sms":false,"sms_enable":false,"role":"admin","pbx_mailbox_users":[],"pbx_user_schedules":[]}'
          my_phone = PbxMyPhone.load_from_json(json)
          expect(my_phone).to be_a(PbxMyPhone)
        end
    end

    describe ".load_by_user" do
        it "should return the current PbxMyPhone object" do          
            my_phone = PbxMyPhone.load_by_user(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone).to be_a(PbxMyPhone)
            expect(my_phone.username).to eq(@currentUser[:username])
        end
    end

    describe ".get_forward_behaviors" do
        it "should return a JSON object of Forward Behaviors" do          
            my_phone = PbxMyPhone.get_forward_behaviors(@currentUser)
            expect(my_phone).not_to be_nil
        end
    end

    describe ".get_oncall_behaviors" do
        it "should return a JSON object of On Call Behaviors" do          
            my_phone = PbxMyPhone.get_oncall_behaviors(@currentUser)
            expect(my_phone).not_to be_nil
        end
    end

    describe "#save" do        
        my_phone = PbxMyPhone.new
        it "should return the current PbxMyPhone object" do          
            my_phone = PbxMyPhone.load_by_user(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone).to be_a(PbxMyPhone)
            expect(my_phone.username).to eq(@currentUser[:username])
        end
        it "should update fields to the backend server" do
            if my_phone.email == "test_a@email.com"
                my_phone.email = "test_b@email.com"
            else
                my_phone.email = "test_a@email.com"
            end
            response = my_phone.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            my_phone2 = PbxMyPhone.load_by_user(@currentUser)
            expect(my_phone2).not_to be_nil
            expect(my_phone2).to be_a(PbxMyPhone)
            expect(my_phone2.username).to eq(@currentUser[:username])
            expect(my_phone2.email).to eq(my_phone.email)
        end
    end
end