describe PbxAuditLog do
    before do
        @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_by_user" do
        it "should return the PbxAuditLog collection" do          
            my_test_object = PbxAuditLog.load_by_user(@currentUser)
            expect(my_test_object).not_to be_nil
        end
    end
end