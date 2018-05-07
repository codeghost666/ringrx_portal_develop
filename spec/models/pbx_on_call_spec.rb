describe PbxOnCall do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxOnCall object" do
            json = '{"id":1,"pbx_account_id":1,"name":"OnCall_824","extension":"824","greeting":"","moh":"miami_viceroy.mp3","mailbox":"OnCall_824@test.ringrx.com","record_calls":false,"retries":3,"minutes":5,"callerid":"8183039450","created_at":"2018-02-07T02:55:48.000Z","updated_at":"2018-02-07T03:00:00.000Z","shift_alarm":"ryan@ringrx.com","shift_alarm_suppress":"2018-02-07T04:00:00.000Z","shift_alarm_minutes":60,"pbx_oncall_shifts":[{"id":1,"pbx_oncall_id":1,"name":"Shift 1","priority":1,"day_sun":false,"day_mon":true,"day_tue":false,"day_wed":true,"day_thu":false,"day_fri":true,"day_sat":false,"start_time":"2000-01-01T00:00:00.000Z","end_time":"2000-01-01T23:59:00.000Z","start_at":null,"end_at":null,"metric":221011020,"created_at":"2018-02-07T02:55:48.000Z","updated_at":"2018-02-07T03:04:36.000Z","pbx_oncall_shift_users":[{"id":1,"pbx_oncall_shift_id":1,"pbx_user_id":60,"priority":1,"created_at":"2018-02-07T03:04:36.000Z","updated_at":"2018-02-07T03:04:36.000Z","suppress_reminder":"2018-02-07T03:04:36.000Z","pbx_user":{"name":"Damon"}}]}]}'
            my_test_object = PbxOnCall.load_from_json(json)
            expect(my_test_object).to be_a(PbxOnCall)
        end
    end

    describe "#save|create|update|delete" do        
    my_test_object = PbxOnCall.new
        it "should build a PbxOnCall object from json" do
            json = '{"pbx_account_id":1,"name":"OnCall_999","extension":"999","greeting":"","moh":"miami_viceroy.mp3","mailbox":"OnCall_999@test.ringrx.com","record_calls":false,"retries":3,"minutes":5,"callerid":"8183039450","created_at":"2018-02-07T02:55:48.000Z","updated_at":"2018-02-07T03:00:00.000Z","shift_alarm":"ryan@ringrx.com","shift_alarm_suppress":"2018-02-07T04:00:00.000Z","shift_alarm_minutes":60,"pbx_oncall_shifts":[{"name":"Shift 1","priority":1,"day_sun":false,"day_mon":true,"day_tue":false,"day_wed":true,"day_thu":false,"day_fri":true,"day_sat":false,"start_time":"2000-01-01T00:00:00.000Z","end_time":"2000-01-01T23:59:00.000Z","start_at":null,"end_at":null,"metric":221011020,"created_at":"2018-02-07T02:55:48.000Z","updated_at":"2018-02-07T03:04:36.000Z","pbx_oncall_shift_users":[{"pbx_user_id":60,"priority":1,"created_at":"2018-02-07T03:04:36.000Z","updated_at":"2018-02-07T03:04:36.000Z","suppress_reminder":"2018-02-07T03:04:36.000Z","pbx_user":{"name":"Damon"}}]}]}'
            my_test_object = PbxOnCall.load_from_json(json)
            expect(my_test_object).to be_a(PbxOnCall)
            expect(my_test_object.id).to be_nil
        end
        it "should save the PbxOnCall to the backend" do
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_test_object.id).not_to be_nil            
        end
        it "should return the current PbxOnCall collection containing the new item" do
            check_create_object = PbxOnCall.load_by_user(@currentUser).find_all { |obj| obj.id == my_test_object.id}.first
            expect(check_create_object).not_to be_nil
            expect(check_create_object).to be_a(PbxOnCall)
            expect(check_create_object.id).to eq(my_test_object.id)
        end
        it "should return the new PbxOnCall item when fetched by id" do
            check_create_object_by_id = PbxOnCall.load_by_oncall_id(@currentUser, my_test_object.id)
            expect(check_create_object_by_id).not_to be_nil
            expect(check_create_object_by_id).to be_a(PbxOnCall)
            expect(check_create_object_by_id.id).to eq(my_test_object.id)
        end
        it "should update fields to the backend server" do
            my_test_object.extension = "998"
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            check_update_object = PbxOnCall.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_update_object).not_to be_nil
            expect(check_update_object).to be_a(PbxOnCall)
            expect(check_update_object.extension).to eq(my_test_object.extension)
        end       
        it "should delete the created object" do
            response = PbxOnCall.delete(@currentUser, my_test_object.id)
            expect(response.code).to eq(204)
            check_delete_object = PbxOnCall.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_delete_object).to be_nil
        end
    end    

    describe ".moh" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.moh(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".mediafiles" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.mediafiles(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".mailboxes" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.mailboxes(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".phonenumbers" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.phonenumbers(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".pbx_users" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.pbx_users(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".get_new" do
        it "should return a JSON list" do          
            my_user = PbxOnCall.get_new(@currentUser)
            expect(my_user).not_to be_nil
        end
    end
end