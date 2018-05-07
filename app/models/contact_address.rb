class ContactAddress < RestModel
  property :type
  property :address
  
  belongs_to :contact
end