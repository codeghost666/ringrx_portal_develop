describe PbxMediaFile do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @sample_file = fixture_file_upload('/files/upload_media.mp3', 'audio/mp3')
        @second_file = fixture_file_upload('/files/second_media.mp3', 'audio/mp3')
    end

    describe ".load_from_json" do
        it "should return a PbxMediaFile object" do
          json = '{"id":1,"pbx_account_id":1,"uuid":"ce9899aa-bd0a-4ee8-aa12-66283e438f4d","name":"RickRoll","filename":"Rick Astley - Never Gonna Give You Up.mp3","mime_type":"audio/mp3","file_type":"mp3"}'
          my_location = PbxMediaFile.load_from_json(json)
          expect(my_location).to be_a(PbxMediaFile)
        end
    end

    describe ".load_from_json|minimal" do
        it "should return a PbxMediaFile object" do
          json = '{"pbx_account_id":1,"name":"Unit Test"}'
          media_file = PbxMediaFile.load_from_json(json)
          media_file.mediafile = @sample_file
          expect(media_file).to be_a(PbxMediaFile)
          expect(media_file.valid?).to eq(true)
        end
    end

    describe ".load_by_user" do
        it "should return the PbxMediaFile collection" do          
            media_files = PbxMediaFile.load_by_user(@currentUser)
            expect(media_files).not_to be_nil
            expect(media_files.count).to be >= 1
        end
    end

    describe "#save|create|update|delete" do        
        my_file = PbxMediaFile.new
        it "should build a PbxMediaFile object from json" do
            json = '{"pbx_account_id":1,"name":"RickRoll"}'
            my_file = PbxMediaFile.load_from_json(json)
            expect(my_file).to be_a(PbxMediaFile)
            expect(my_file.id).to be_nil
            my_file.mediafile = @sample_file
        end
        it "should save the PbxMediaFile to the backend" do
            response = my_file.save(@currentUser)
            expect(response.code).to eq(200)
            expect(my_file.id).not_to be_nil
        end
        it "should return the current PbxMediaFile collection" do
            files = PbxMediaFile.load_by_user(@currentUser)
            check_create_file = files.find_all { |file| file.id == my_file.id}.first
            expect(check_create_file).not_to be_nil
            expect(check_create_file).to be_a(PbxMediaFile)
            expect(check_create_file.id).to eq(my_file.id)
        end
        it "should update fields to the backend server" do
            my_file.name = "test_update_b"
            my_file.mediafile = @second_file
            response = my_file.save(@currentUser)
            expect(response.code).to eq(200)
        end
        it "should reflect the updated values when fetched agains from the backend" do
            check_update_file = PbxMediaFile.load_by_user(@currentUser).find_all { |file| file.id == my_file.id}.first
            expect(check_update_file).not_to be_nil
            expect(check_update_file).to be_a(PbxMediaFile)
            expect(check_update_file.name).to eq(my_file.name)
            expect(check_update_file.uuid).to eq(my_file.uuid)
        end
        it "should delete the created file" do
            response = PbxMediaFile.delete(@currentUser, my_file.id)
            expect(response.code).to eq(204)
            check_delete_file = PbxMediaFile.load_by_user(@currentUser).find_all { |file| file.id ==  my_file.id}.first
            expect(check_delete_file).to be_nil
        end
    end

end