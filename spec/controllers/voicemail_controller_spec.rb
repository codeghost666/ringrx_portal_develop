describe VoicemailController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @headers = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    # describe "#get_by_user" do
    #     it "should return a Voicemail object collection" do
    #         get '/voicemails', :headers => @headers
    #         expect(response).to have_http_status(200)
    #         expect(vm_list.count).to be > 0
    #         expect(vm_list.first).to be_a(VoicemailMessage)
    #         message = VoicemailMessage.load_from_json(response.body)
    #         expect(message).to be_a(VoicemailMessage)
    #         expect(message.id).not_to be_nil
    #     end
    # end
end