describe PbxMailbox do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @sample_file = fixture_file_upload('/files/upload_media.mp3', 'audio/mp3')
    end

    describe ".load_from_json" do
        it "should return a PbxMailbox object" do
          json = '{"mailbox":"damon@test.ringrx.com","pin":"746478","transcription":"true","play_envelope":"true","quota":"104857600","quota_use":"139564","email_content":"","email_notification":"damon2@test.com","id":"901e0f2fc1233ba1c8882590ac1f7a43"}'
          vm_message = PbxMailbox.load_from_json(json)
          expect(vm_message).to be_a(PbxMailbox)
        end
    end

    describe ".load_by_user" do
        it "should return a PbxMailbox object" do          
            mailbox = PbxMailbox.load_by_user(@currentUser).first
            expect(mailbox).not_to be_nil
            expect(mailbox).to be_a(PbxMailbox)
            expect(mailbox.mailbox).to eq("#{@currentUser[:username]}@#{@currentUser[:domain]}")
        end
    end

    describe ".set_greeting | .get_greeting" do
        mailbox = PbxMailbox.load_by_user(@currentUser).first
        it "should save a specified media file as the greeting and return 200 OK" do            
            response = PbxMailbox.save_greeting(@currentUser, mailbox.id, @sample_file)
            expect(response.code).to eq(200)
        end
        it "should return voice binary data saved as the greeting in the collection" do            
            voice_data = PbxMailbox.get_greeting(@currentUser, mailbox.id)
            expect(voice_data).not_to be_nil
        end
    end

    describe "#save|no_notifications" do
        mailbox = PbxMailbox.new
        it "should update a PbxMailbox object" do
            mailbox = PbxMailbox.load_by_user(@currentUser).first
            expect(mailbox).not_to be_nil
            if mailbox.play_envelope
                mailbox.play_envelope = "false"
            else
                mailbox.play_envelope = "true"
            end
            response = mailbox.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should match the new value to the saved value" do
            mailbox2 = PbxMailbox.load_by_user(@currentUser).first
            expect(mailbox2.play_envelope).to eq(mailbox.play_envelope)
        end
    end

    describe "#save|with_notifications" do        
        mailbox = PbxMailbox.new
        it "should update a PbxMailbox object" do
            mailbox = PbxMailbox.load_by_user(@currentUser).first
            expect(mailbox).not_to be_nil
            if mailbox.play_envelope
                mailbox.email_notification = "damon@test.com"
            else
                mailbox.email_notification = "damon@ringrx.com"
            end
            response = mailbox.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should match the new value to the saved value" do
            mailbox2 = PbxMailbox.load_by_user(@currentUser).first
            expect(mailbox2.email_notification).to eq(mailbox.email_notification)
        end
    end
end