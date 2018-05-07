class PbxOnCallShiftUser < RestModel
    include ActiveModel::Validations

    property :id
    property :pbx_oncall_shift_id #Display Only
    property :pbx_user_id
    property :priority

    validates :pbx_user_id, presence: true

end