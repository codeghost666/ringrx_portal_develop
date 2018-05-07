describe CallRecord do
    before do
      @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
    end

    describe ".load_by_user" do
        it "should return some CDRs" do
            start_date = Time.strptime("10-01-2017 " + Time.now.utc.strftime("%H:%M:%S%z"), "%m-%d-%Y %H:%M:%S%z")
            calls = CallRecord.load_by_user(@currentUser, start_date, nil)
            expect(calls).not_to be_nil
            expect(calls.first).to be_a(CallRecord)
            expect(calls.first.id).not_to be_nil
        end
    end
end