class PbxPhoneNumberRule < RestModel
    include ActiveModel::Validations

    belongs_to :pbx_phone_number

    property :id
    property :pbx_phone_number_id
    property :prefix
    property :action
    property :cnam_prefix
    property :extension
    property :weight

    validates :pbx_phone_number, presence: true
    validates :prefix, presence: true
    validates :action, presence: true
    validates :cnam_prefix, presence: true, unless: Proc.new { |r| r.action != "prefix" }
    validates :extension, presence: true, unless: Proc.new { |r| r.action != "route" }
    validates :action, :inclusion  => { :in => lambda { |r| r.class::ACTIONS.values } }  
  
  ACTIONS = {
    'Reject Busy' => 'busy',
    'Reject 503' => 'unavail',
    'CNAM Prefix' => 'prefix',
    'Route' => 'route',
  }

end