describe PbxFax do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_from_json" do
        it "should return a PbxFax object" do
          json = '{"id":1,"pbx_account_id":1,"name":"Ryan Fax","extension":"801","default_callerid":"8183039450","default_format":"pdf","destination_type":"email","destination_email":"","destination_mailbox":"rdelgrosso@test.ringrx.com","notification_email":"","notify_failure":false,"created_at":"2017-07-25T17:35:15.000Z","updated_at":"2017-07-25T17:35:15.000Z"}'
          phone_number = PbxFax.load_from_json(json)
          expect(phone_number).to be_a(PbxFax)
        end
    end

    describe ".load_by_user" do
        it "should return the current PbxFax collection" do          
            faxes = PbxFax.load_by_user(@currentUser)
            expect(faxes).not_to be_nil
            expect(faxes.count).to be > 0
        end
    end

    describe ".get_phonenumbers" do
        it "should return a JSON object of Phone Numbers" do          
            numbers = PbxFax.get_phonenumbers(@currentUser)
            expect(numbers).not_to be_nil
            expect(numbers.count).to be >= 1
        end
    end

    describe ".get_formats" do
        it "should return a JSON object of Fax formats" do          
            formats = PbxFax.get_formats(@currentUser)
            expect(formats).not_to be_nil
            expect(formats.count).to be >= 1
        end
    end

    describe ".get_destination_types" do
        it "should return a JSON object of Destination Types" do          
            numbers = PbxFax.get_destination_types(@currentUser)
            expect(numbers).not_to be_nil
            expect(numbers.count).to be >= 1
        end
    end

    describe ".get_mailboxes" do
        it "should return a JSON object of Mailboxes" do          
            mailboxes = PbxFax.get_mailboxes(@currentUser)
            expect(mailboxes).not_to be_nil
            expect(mailboxes.count).to be >= 1
        end
    end

    describe "#save|create|update|delete" do        
        my_fax = PbxFax.new
        it "should build a PbxFax object from json" do
            json = '{"pbx_account_id":1,"name":"Unit Test","extension":"301","default_callerid":"8183039450","default_format":"pdf","destination_type":"email","destination_email":"","destination_mailbox":"rdelgrosso@test.ringrx.com","notification_email":"","notify_failure":false}'
            my_fax = PbxFax.load_from_json(json)
            expect(my_fax).to be_a(PbxFax)
            expect(my_fax.id).to be_nil
        end
        it "should save the PbxFax to the backend" do
            response = my_fax.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_fax.id).not_to be_nil
        end
        it "should return the current PbxFax collection" do
            faxes = PbxFax.load_by_user(@currentUser)
            check_create_fax = faxes.find_all { |fax| fax.id == my_fax.id}.first
            expect(check_create_fax).not_to be_nil
            expect(check_create_fax).to be_a(PbxFax)
            expect(check_create_fax.id).to eq(my_fax.id)
        end
        it "should update fields to the backend server" do
            if my_fax.name == "test_update_a"
                my_fax.name = "test_update_b"
            else
                my_fax.name = "test_update_a"
            end
            response = my_fax.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            check_update_fax = PbxFax.load_by_id(@currentUser, my_fax.id)
            expect(check_update_fax).not_to be_nil
            expect(check_update_fax).to be_a(PbxFax)
            expect(check_update_fax.name).to eq(my_fax.name)
        end
        it "should delete the created fax" do
            response = PbxFax.delete(@currentUser, my_fax.id)
            expect(response.code).to eq(204)
            check_delete_fax = PbxFax.load_by_user(@currentUser).find_all { |fax| fax.id ==  my_fax.id}.first
            expect(check_delete_fax).to be_nil
        end
    end
end