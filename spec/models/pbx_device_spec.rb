describe PbxDevice do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxDevice object" do
            json = '{"name":"Test Device 1","signaling": "tcp","pbx_account_id":1,"device_type":"obihai-phone-1000","macaddress":"FFFFFFFFFFFF","pbx_user_id":60,"display_name":"Sample Device","shared":null,"created_at":"2018-01-28T22:22:27.000Z","updated_at":"2018-01-28T22:22:27.000Z","pbx_device_bindings":[{"binding_index":1,"binding_type":"line","binding_behavior":"line","binding_display":"Display Field","binding_argument":"Argument Field","pbx_user_id":60,"created_at":"2018-01-28T22:23:23.000Z","updated_at":"2018-01-28T22:23:23.000Z"}]}'
            my_test_object = PbxDevice.load_from_json(json)
            expect(my_test_object).to be_a(PbxDevice)
            expect(my_test_object.pbx_device_bindings.count).to eq(1)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxDevice collection" do          
            my_test_object = PbxDevice.load_by_user(@currentUser)
            expect(my_test_object).not_to be_nil
        end
    end

    describe "#save|create|update|delete" do        
    my_test_object = PbxDevice.new
        it "should build a PbxDevice object from json" do
            json = '{"name":"Test Device 1","signaling": "tcp","pbx_account_id":1,"device_type":"obihai-phone-1000","macaddress":"FFFFFFFFFFFF","pbx_user_id":60,"display_name":"Sample Device","shared":null,"created_at":"2018-01-28T22:22:27.000Z","updated_at":"2018-01-28T22:22:27.000Z","pbx_device_bindings":[{"binding_index":1,"binding_type":"line","binding_behavior":"line","binding_display":"Display Field","binding_argument":"Argument Field","pbx_user_id":60,"created_at":"2018-01-28T22:23:23.000Z","updated_at":"2018-01-28T22:23:23.000Z"}]}'
            my_test_object = PbxDevice.load_from_json(json)
            my_test_object.to_json
            expect(my_test_object).to be_a(PbxDevice)
            expect(my_test_object.id).to be_nil
            expect(my_test_object.pbx_device_bindings.count).to eq(1)
        end
        it "should save the PbxDevice to the backend" do
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_test_object.id).not_to be_nil            
        end
        it "should return the current PbxDevice collection" do
            check_create_object = PbxDevice.load_by_user(@currentUser).find_all { |obj| obj.id == my_test_object.id}.first
            expect(check_create_object).not_to be_nil
            expect(check_create_object).to be_a(PbxDevice)
            expect(check_create_object.id).to eq(my_test_object.id)
            expect(check_create_object.pbx_device_bindings.to_json).to eq(my_test_object.pbx_device_bindings.to_json)
        end
        it "should update fields to the backend server" do
            my_test_object.name = "test_update_a"
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            check_update_object = PbxDevice.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_update_object).not_to be_nil
            expect(check_update_object).to be_a(PbxDevice)
            expect(check_update_object.name).to eq(my_test_object.name)
            expect(check_update_object.pbx_device_bindings.to_json).to eq(my_test_object.pbx_device_bindings.to_json)
        end
        it "should delete the created object" do
            response = PbxDevice.delete(@currentUser, my_test_object.id)
            expect(response.code).to eq(204)
            check_delete_object = PbxDevice.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_delete_object).to be_nil
        end
    end

    describe ".device_types" do
        it "should return a JSON list" do          
            my_user = PbxDevice.device_types(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".binding_types" do
        it "should return a JSON list" do          
            my_user = PbxDevice.binding_types(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".binding_behaviors" do
        it "should return a JSON list" do          
            my_user = PbxDevice.binding_behaviors(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".pbx_users" do
        it "should return a JSON list" do          
            my_user = PbxDevice.pbx_users(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".pbx_parking_lots" do
        it "should return a JSON list" do          
            my_user = PbxDevice.pbx_parking_lots(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

end