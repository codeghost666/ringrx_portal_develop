describe PbxLocation do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxLocation object" do
          json = '{"pbx_account_id":1,"name":"Home","address":"9727 Wheatland Ave","city":"Sunland","state":"Ca","zip":"91342","emergency":null,"created_at":"2017-07-25T17:32:18.000Z","updated_at":"2017-07-25T17:32:18.000Z"}'
          my_location = PbxLocation.load_from_json(json)
          expect(my_location).to be_a(PbxLocation)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxLocation collection" do          
            locations = PbxLocation.load_by_user(@currentUser)
            expect(locations).not_to be_nil
            expect(locations.count).to be >= 1
        end
    end

    describe "#save|create|update|delete" do        
        my_location = PbxLocation.new
        it "should build a PbxLocation object from json" do
            json = '{"pbx_account_id":1,"name":"Home","address":"9727 Wheatland Ave","city":"Sunland","state":"Ca","zip":"91342","emergency":null,"created_at":"2017-07-25T17:32:18.000Z","updated_at":"2017-07-25T17:32:18.000Z"}'
            my_location = PbxLocation.load_from_json(json)
            expect(my_location).to be_a(PbxLocation)
            expect(my_location.id).to be_nil
        end
        it "should save the PbxLocation to the backend" do
            response = my_location.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_location.id).not_to be_nil
        end
        it "should return the current PbxLocation collection" do
            locs = PbxLocation.load_by_user(@currentUser)
            check_create_loc = locs.find_all { |loc| loc.id == my_location.id}.first
            expect(check_create_loc).not_to be_nil
            expect(check_create_loc).to be_a(PbxLocation)
            expect(check_create_loc.id).to eq(my_location.id)
        end
        it "should update fields to the backend server" do
            if my_location.name == "test_update_a"
                my_location.name = "test_update_b"
            else
                my_location.name = "test_update_a"
            end
            response = my_location.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            check_update_loc = PbxLocation.load_by_user(@currentUser).find_all { |loc| loc.id ==  my_location.id}.first
            expect(check_update_loc).not_to be_nil
            expect(check_update_loc).to be_a(PbxLocation)
            expect(check_update_loc.name).to eq(my_location.name)
        end
        it "should delete the created location" do
            response = PbxLocation.delete(@currentUser, my_location.id)
            expect(response.code).to eq(204)
            check_delete_loc = PbxLocation.load_by_user(@currentUser).find_all { |loc| loc.id ==  my_location.id}.first
            expect(check_delete_loc).to be_nil
        end
    end

end