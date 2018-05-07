describe Contact do
  before do
    @currentUser = {username: "damon", extension: "812", domain: "test.ringrx.com", backend: "https://engine01.dev2.ringrx.com", role: "admin" ,:exp => Time.now.to_i + (7 * 24 * 3600)}
  end

  describe ".load_from_json" do
    it "should return a contact object" do
      json = '{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Delgrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}'
      contact = Contact.load_from_json(@currentUser, json)
      expect(contact).to be_a(Contact)
    end
  end

  describe "#create|.load_by_id|#delete" do    
    contact = Contact.new
    it "should create a new contact" do
      # Create the contact object
      json = '{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}'
      contact = Contact.load_from_json(@currentUser, json)
      expect(contact).to be_a(Contact)
      # Save contact object
      saveResponse = contact.save(@currentUser)
      expect(saveResponse.code).to eq(200)
      expect(contact.id).not_to be_nil
    end
    it "should fetch that contact" do 
      fetchContact = Contact.load_by_id(@currentUser, contact.id)
      expect(fetchContact).to be_a(Contact)
      expect(fetchContact.id).to eq(contact.id)
    end
    it "should delete the contact it created earlier" do
      deleteResponse = contact.delete(@currentUser)
      expect(deleteResponse.code).to eq(204)
    end
    it "should get a 404 when looking for the deleted contact" do
      failedFetchResponse = Contact.load_by_id(@currentUser, contact.id)
      expect(failedFetchResponse.code).to eq(404)
    end
  end

  describe "#create|#save|.load_by_id|#delete" do    
    contact = Contact.new
    it "should create a new contact" do
      # Create the contact object
      json = '{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"private","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}'
      contact = Contact.load_from_json(@currentUser, json)
      expect(contact).to be_a(Contact)
      # Save contact object
      saveResponse = contact.save(@currentUser)
      expect(saveResponse.code).to eq(200)
      expect(contact.id).not_to be_nil
    end
    it "should update the contact object" do
      contact.email = "updated@email.com"
      updateResponse = contact.save(@currentUser)
      expect(updateResponse.code).to eq(200)
    end
    it "should fetch that contact" do 
      fetchContact = Contact.load_by_id(@currentUser, contact.id)
      expect(fetchContact).to be_a(Contact)
      expect(fetchContact.id).to eq(contact.id)
      expect(fetchContact.email).to eq(contact.email)
    end
    it "should delete the contact it created earlier" do
      deleteResponse = contact.delete(@currentUser)
      expect(deleteResponse.code).to eq(204)
    end
    it "should get a 404 when looking for the deleted contact" do
      failedFetchResponse = Contact.load_by_id(@currentUser, contact.id)
      expect(failedFetchResponse.code).to eq(404)
    end
  end

  describe "#create|.load_by_user|#delete" do    
    contact = Contact.new
    it "should create a new group contact" do
      # Create the contact object
      json = '{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"group","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}'
      contact = Contact.load_from_json(@currentUser, json)
      expect(contact).to be_a(Contact)
      # Save contact object
      saveResponse = contact.save(@currentUser)
      expect(saveResponse.code).to eq(200)
      expect(contact.id).not_to be_nil
    end
    it "should fetch the domain contacts and confirm the new contact is present" do 
      contactsList = Contact.load_by_user(@currentUser)
      expect(contactsList.find { |item| item.id == contact.id}).to_not be_nil
      expect(contactsList.find { |item| item.id == contact.id}).to be_a(Contact)
    end
    it "should delete the contact it created earlier" do
      deleteResponse = contact.delete(@currentUser)
      expect(deleteResponse.code).to eq(204)
    end
    it "should get a 404 when looking for the deleted contact" do
      failedFetchResponse = Contact.load_by_id(@currentUser, contact.id)
      expect(failedFetchResponse.code).to eq(404)
    end
  end

  describe "#create|.load_by_domain|#delete" do    
    contact = Contact.new
    it "should create a new group contact" do
      # Create the contact object
      json = '{"telephone":[{"type":"mobile","number":"+18187923636"},{"type":"home","number":"+18184924160"}],"address":[{"type":"home","address":"11300 Foothill Blvd\nUnit 83\nLake View Terrace, Ca, 91342"}],"contact_type":"group","name":"Ryan Degrosso","org":"RingRX","title":"Admin","photo":null,"email":"rdelgrosso@ringrx.com"}'
      contact = Contact.load_from_json(@currentUser, json)
      expect(contact).to be_a(Contact)
      # Save contact object
      saveResponse = contact.save(@currentUser)
      expect(saveResponse.code).to eq(200)
      expect(contact.id).not_to be_nil
    end
    it "should fetch the domain contacts and confirm the new contact is present" do 
      contactsList = Contact.load_by_domain(@currentUser)
      expect(contactsList.find { |item| item.id == contact.id}).to_not be_nil
      expect(contactsList.find { |item| item.id == contact.id}).to be_a(Contact)
    end
    it "should delete the contact it created earlier" do
      deleteResponse = contact.delete(@currentUser)
      expect(deleteResponse.code).to eq(204)
    end
    it "should get a 404 when looking for the deleted contact" do
      failedFetchResponse = Contact.load_by_id(@currentUser, contact.id)
      expect(failedFetchResponse.code).to eq(404)
    end
  end

end