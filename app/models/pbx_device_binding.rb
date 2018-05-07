class PbxDeviceBinding < RestModel
    include ActiveModel::Validations

    belongs_to :pbx_device

    property :id
    property :pbx_device_id
    property :binding_index
    property :binding_type
    property :binding_behavior
    property :binding_display
    property :binding_argument
    property :pbx_user_id
    property :pbx_parking_lot_id

    validates :pbx_user_id, presence: true, unless: Proc.new { |b| b.binding_behavior == "speeddial" || b.binding_behavior == "park" || b.binding_behavior == "empty" }
    validates :pbx_device_id, presence: true
    
end