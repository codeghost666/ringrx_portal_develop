#[{"id":1,"pbx_account_id":1,"extension":"501","moh":"nowhere_land.mp3","timeout":0,"timeout_extension":"","created_at":"2017-07-25T17:34:58.000Z","updated_at":"2017-07-25T17:34:58.000Z"}]
describe PbxParkingLot do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxParkingLot object" do
            json = '{"id":1,"pbx_account_id":1,"extension":"501","moh":"nowhere_land.mp3","timeout":0,"timeout_extension":"","created_at":"2017-07-25T17:34:58.000Z","updated_at":"2017-07-25T17:34:58.000Z"}'
            my_test_object = PbxParkingLot.load_from_json(json)
            expect(my_test_object).to be_a(PbxParkingLot)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxParkingLot collection" do          
            my_test_object = PbxParkingLot.load_by_user(@currentUser)
            expect(my_test_object).not_to be_nil
        end
    end

    describe "#save|create|update|delete" do        
    my_test_object = PbxParkingLot.new
        it "should build a PbxParkingLot object from json" do
            json = '{"pbx_account_id":1,"extension":"999","moh":"nowhere_land.mp3","timeout":0,"timeout_extension":"1001","created_at":"2017-07-25T17:34:58.000Z","updated_at":"2017-07-25T17:34:58.000Z"}'
            my_test_object = PbxParkingLot.load_from_json(json)
            expect(my_test_object).to be_a(PbxParkingLot)
            expect(my_test_object.id).to be_nil
        end
        it "should save the PbxParkingLot to the backend" do
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_test_object.id).not_to be_nil            
        end
        it "should return the current PbxParkingLot collection containing the new item" do
            check_create_object = PbxParkingLot.load_by_user(@currentUser).find_all { |obj| obj.id == my_test_object.id}.first
            expect(check_create_object).not_to be_nil
            expect(check_create_object).to be_a(PbxParkingLot)
            expect(check_create_object.id).to eq(my_test_object.id)
        end
        it "should update fields to the backend server" do
            my_test_object.extension = "998"
            response = my_test_object.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            check_update_object = PbxParkingLot.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_update_object).not_to be_nil
            expect(check_update_object).to be_a(PbxParkingLot)
            expect(check_update_object.extension).to eq(my_test_object.extension)
        end       
        it "should delete the created object" do
            response = PbxParkingLot.delete(@currentUser, my_test_object.id)
            expect(response.code).to eq(204)
            check_delete_object = PbxParkingLot.load_by_user(@currentUser).find_all { |obj| obj.id ==  my_test_object.id}.first
            expect(check_delete_object).to be_nil
        end
    end

    describe ".extensions" do
        it "should return a JSON list" do          
            my_user = PbxParkingLot.get_extensions(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

    describe ".moh" do
        it "should return a JSON list" do          
            my_user = PbxParkingLot.get_moh(@currentUser)
            expect(my_user).not_to be_nil
        end
    end

end