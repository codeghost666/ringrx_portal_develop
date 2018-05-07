class ContactTelephone < RestModel

    property :type
    property :number
    belongs_to :contact
end