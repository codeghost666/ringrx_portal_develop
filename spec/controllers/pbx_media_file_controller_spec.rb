describe PbxMediaFileController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
        @upload_headers = { "Content-Type" => 'multipart/form-data', :Accept => "*/*" , "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
        @sample_file = fixture_file_upload('/files/upload_media.mp3', 'audio/mp3')
        @second_file = fixture_file_upload('/files/second_media.mp3', 'audio/mp3')
    end

    describe "GET /pbxmediafiles | #get_by_user" do
        it "should fetch the PBX Media File List" do
          get '/pbxmediafiles', :headers => @headers
          expect(response).to have_http_status(200)          
          loc = PbxMediaFile.load_from_json(JSON.parse(response.body).first.to_json)
          expect(loc).to be_a(PbxMediaFile)
          expect(loc.id).not_to be_nil
        end
    end

    describe "POST | GET | PATCH | GET | DELETE " do        
        my_file = PbxMediaFile.new
        it "should save the PbxMediaFile to the backend" do
            json = '{"pbx_account_id":1,"name":"Unit Test"}'
            my_file = PbxMediaFile.load_from_json(json)
            expect(my_file).to be_a(PbxMediaFile)
            expect(my_file.id).to be_nil
            my_file.mediafile = @sample_file
            
            post '/pbxmediafiles', :params => { pbx_media_file: { mediafile: my_file.mediafile, name: my_file.name, pbx_account_id: my_file.pbx_account_id } }, :headers => @upload_headers
            expect(response).to have_http_status(200)
            my_file.id = JSON.parse(response.body)['id']
            my_file.uuid = JSON.parse(response.body)['uuid']
        end
        it "should return the current PbxMediaFile collection" do
            get '/pbxmediafiles', :headers => @headers
            expect(response).to have_http_status(200)
            files = PbxMediaFile.from_source(JSON.parse(response.body))
            fetch_file = files.find_all { |file| file.id == my_file.id.to_s}.first
            expect(fetch_file).to be_a(PbxMediaFile)
            expect(fetch_file).not_to be_nil
        end
        it "should update fields to the backend server" do
            my_file.name = "test_update_b"
            my_file.mediafile = @second_file
            patch '/pbxmediafiles', :params => { pbx_media_file: { id: my_file.id, mediafile: my_file.mediafile, name: my_file.name, pbx_account_id: my_file.pbx_account_id } }, :headers => @upload_headers
            expect(response).to have_http_status(200)
        end
        it "should reflect the updated values when fetched again from the backend" do
            get '/pbxmediafiles', :headers => @headers
            expect(response).to have_http_status(200)
            files = PbxMediaFile.from_source(JSON.parse(response.body))
            fetch_file = files.find_all { |file| file.id == my_file.id.to_s}.first
            expect(fetch_file).to be_a(PbxMediaFile)
            expect(fetch_file).not_to be_nil
            expect(fetch_file.name).to eq(my_file.name)
            expect(fetch_file.uuid).to eq(my_file.uuid)
        end
        it "should delete the created location" do
            delete "/pbxmediafiles/#{my_file.id}", :headers => @headers
            expect(response).to have_http_status(204)            
        end
    end
end