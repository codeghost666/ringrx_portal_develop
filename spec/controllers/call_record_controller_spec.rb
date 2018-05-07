describe ContactsController, :type => :request do 
    before do
        @token = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com:8443", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
        @parameters = { "Content-Type" => 'application/json', "Authorization" => "Bearer #{JsonWebToken.encode(@token)}" }
    end

    describe "#load_by_user" do
        contact = Contact.new           
        it "should fetch CDRs" do 
          get "/cdrs?startDate=01-09-2017", :headers => @parameters
          expect(response).to have_http_status(200)
          #fetchContact = Contact.load_from_json(@token, response.body)
          #expect(fetchContact).to be_a(Contact)
        end
    end
end