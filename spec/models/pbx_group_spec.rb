describe PbxGroup do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxGroup object" do
            json = '{"pbx_account_id":1,"name":"Test Group","extension":"823","sequential":false,"cnam_prefix":"","created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","call_timeout":24,"mailbox":"","pbx_group_users":[{"pbx_user_id":60,"priority":1,"created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","pbx_user":{"name":"Damon"}}]}'
            my_test_object = PbxGroup.load_from_json(json)
            expect(my_test_object).to be_a(PbxGroup)
            expect(my_test_object.pbx_group_users.count).to eq(1)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxGroup collection" do          
            my_test_object = PbxGroup.load_by_user(@currentUser)
            expect(my_test_object).not_to be_nil
        end
    end

    describe "#save|create|update|delete" do        
    my_test_object = PbxGroup.new
        it "should build a PbxGroup object from json" do
            json = '{"pbx_account_id":1,"name":"Test Group","sequential":false,"cnam_prefix":"","created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","call_timeout":24,"mailbox":"","pbx_group_users":[{"pbx_user_id":60,"priority":1,"created_at":"2018-01-29T02:00:39.000Z","updated_at":"2018-01-29T02:00:39.000Z","pbx_user":{"name":"Damon"}}]}'
            my_test_object = PbxGroup.load_from_json(json)
            expect(my_test_object).to be_a(PbxGroup)
            expect(my_test_object.id).to be_nil
            expect(my_test_object.pbx_group_users.count).to eq(1)
        end
        it "should save the PbxGroup to the backend" do
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_test_object.id).not_to be_nil            
        end
        it "should return the current PbxGroup collection" do
            check_create_object = PbxGroup.load_by_user(@currentUser).find_all { |obj| obj.id == my_test_object.id}.first
            expect(check_create_object).not_to be_nil
            expect(check_create_object).to be_a(PbxGroup)
            expect(check_create_object.id).to eq(my_test_object.id)
            expect(check_create_object.pbx_group_users.to_json).to eq(my_test_object.pbx_group_users.to_json)
        end
        it "should update fields to the backend server" do
            my_test_object.name = "test_update_a"
            new_group_user = PbxGroupUser.new
            new_group_user.pbx_user_id = 6
            my_test_object.pbx_group_users.push(new_group_user)
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            check_update_object = PbxGroup.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_update_object).not_to be_nil
            expect(check_update_object).to be_a(PbxGroup)
            expect(check_update_object.name).to eq(my_test_object.name)
            expect(check_update_object.pbx_group_users.count).to eq(my_test_object.pbx_group_users.count)
        end
        it "should delete a user from the group" do
            response = PbxGroup.delete_group_user(@currentUser, my_test_object.id, my_test_object.pbx_group_users.first.id)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            check_update_object = PbxGroup.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_update_object.pbx_group_users.count).to eq(1)
        end
        it "should delete the created object" do
            response = PbxGroup.delete(@currentUser, my_test_object.id)
            expect(response.code).to eq(204)
            check_delete_object = PbxGroup.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_delete_object).to be_nil
        end
    end

    describe ".ringtones" do
        it "should return a JSON list" do          
            my_user = PbxGroup.ringtones(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".mailboxes" do
        it "should return a JSON list" do          
            my_user = PbxGroup.mailboxes(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".pbx_users" do
        it "should return a JSON list" do          
            my_user = PbxGroup.pbx_users(@currentUser)
            expect(my_user).not_to be_nil
        end
    end    

end