describe PbxPhoneNumber do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxPhoneNumber object" do
          json = '{"id":1,"phonenumber":"8183039450","extension":"1000","cnam_prefix":"","distinctive_ring":"","pbx_account_id":1,"pbx_location_id":null,"forward_destination":"","forward":false,"created_at":"2017-07-25T17:32:18.000Z","updated_at":"2018-01-13T02:42:44.000Z","pbx_phone_number_rules":[]}'
          phone_number = PbxPhoneNumber.load_from_json(json)
          expect(phone_number).to be_a(PbxPhoneNumber)
        end
    end

    describe ".load_by_user" do
        it "should return the current PbxPhoneNumber collection" do          
            phone_numbers = PbxPhoneNumber.load_by_user(@currentUser)
            expect(phone_numbers).not_to be_nil
            expect(phone_numbers.count).to be > 0
        end
    end

    describe ".get_distinctive_ring" do
        it "should return a JSON object of Distinctive Ring options" do          
            my_phone = PbxPhoneNumber.get_distinctive_ring(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone.count).to eq(5)
        end
    end

    describe ".get_extensions" do
        it "should return a JSON object of Distinctive Ring options" do          
            my_phone = PbxPhoneNumber.get_extensions(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone.count).to be >= 1
        end
    end

    describe ".get_locations" do
        it "should return a JSON object of Distinctive Ring options" do          
            my_phone = PbxPhoneNumber.get_locations(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone.count).to be >= 1
        end
    end

    describe ".get_rule_actions" do
        it "should return a JSON object of Distinctive Ring options" do          
            my_phone = PbxPhoneNumber.get_rule_actions(@currentUser)
            expect(my_phone).not_to be_nil
            expect(my_phone.count).to eq(4)
        end
    end

    describe "#save" do
        edit_phone_number = PbxPhoneNumber.new
        it "should return the current PbxPhoneNumber collection" do          
            phone_numbers = PbxPhoneNumber.load_by_user(@currentUser)
            expect(phone_numbers).not_to be_nil
            expect(phone_numbers.count).to be > 0
            edit_phone_number = phone_numbers.first
        end
        it "should update the backend" do
            if edit_phone_number.distinctive_ring == 'Bellcore-dr1'
                edit_phone_number.distinctive_ring = 'Bellcore-dr2'
            else
                edit_phone_number.distinctive_ring = 'Bellcore-dr1'
            end
            response = edit_phone_number.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when re-fetched" do
            phone_numbers = PbxPhoneNumber.load_by_user(@currentUser)
            expect(phone_numbers).not_to be_nil
            expect(phone_numbers.count).to be > 0
            edit_phone_number2 = phone_numbers.find(phonenumber: edit_phone_number.phonenumber).first
            expect(edit_phone_number2).not_to be_nil
            expect(edit_phone_number2.distinctive_ring).to eq(edit_phone_number.distinctive_ring)
        end
    end

end