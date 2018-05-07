describe VoicemailMessage do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @sample_fax = fixture_file_upload('/files/sample_fax.pdf', 'application/pdf')
    end

    describe ".load_from_json" do
        it "should return a VoicemailMessage object" do
          json = '  {            
            "mailbox": "damon@test.ringrx.com",
            "caller": "6616003318",
            "created_at": "2018-01-09T18:02:15.878-08:00",
            "status": "read",
            "message_type": "voicemail",
            "message_folder": "inbox",
            "notes": null,
            "id": "3fc66528385a173d54bf589d671f5769"
          }'
          vm_message = VoicemailMessage.load_from_json(json)
          expect(vm_message).to be_a(VoicemailMessage)
        end
    end

    describe ".load_by_user" do
        it "should return a Voicemail object collection" do          
            vm_list = VoicemailMessage.load_by_user(@currentUser)
            expect(vm_list.count).to be > 0
            expect(vm_list.first).to be_a(VoicemailMessage)
        end
    end

    describe ".load_by_message_id" do
        vm_list = Array.new
        it "should return a Voicemail object collection" do          
            vm_list = VoicemailMessage.load_by_user(@currentUser)
            expect(vm_list.count).to be > 0
            expect(vm_list.first).to be_a(VoicemailMessage)
        end
        it "should return message data for the first object in the collection" do            
            vm_message = VoicemailMessage.load_by_message_id(@currentUser, vm_list.first.id)
            expect(vm_message).not_to be_nil
            expect(vm_message.id).to eq(vm_list.first.id)
        end
    end

    describe ".voice_payload" do
        vm_list = Array.new
        it "should return a Voicemail object collection" do          
            vm_list = VoicemailMessage.load_by_user(@currentUser)
            expect(vm_list.count).to be > 0
            expect(vm_list.first).to be_a(VoicemailMessage)
        end
        it "should return voice binary data for the first object in the collection" do
            voice_data = VoicemailMessage.voice_payload(@currentUser, vm_list.first.id)
            expect(voice_data).not_to be_nil
        end
    end

    describe "#save" do
        vm_list = Array.new
        vm_message = VoicemailMessage.new
        it "should return a Voicemail object collection" do          
            vm_list = VoicemailMessage.load_by_user(@currentUser)
            expect(vm_list.count).to be > 0
            expect(vm_list.first).to be_a(VoicemailMessage)
        end
        it "should return message data for the first object in the collection" do            
            vm_message = VoicemailMessage.load_by_message_id(@currentUser, vm_list.first.id)
            expect(vm_message).not_to be_nil
            expect(vm_message.id).to eq(vm_list.first.id)
        end
        it "should save the message to the backend" do
            if vm_message.status == 'read'
                vm_message.status = 'new'
            else
                vm_message.status = 'read'
            end
            vm_message.save(@currentUser)            
        end
        it "should reflect the updated data when re-fetched" do
            vm_message2 = VoicemailMessage.load_by_message_id(@currentUser, vm_list.first.id)
            expect(vm_message2.status).to eq(vm_message.status)
        end
    end

    describe ".send_fax" do
        it "should send a fax to faxtoy" do
            response = VoicemailMessage.send_fax(@currentUser, "8553301239", @sample_fax)
            puts response.to_json
            expect(response.code).to eq(200)
        end
    end
end