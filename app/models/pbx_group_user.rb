class PbxGroupUser < RestModel
    include ActiveModel::Validations

    belongs_to :pbx_group

    property :id
    property :pbx_group_id
    property :pbx_user_id
    property :priority

    validates :pbx_group_id, presence: true
    validates :pbx_user_id, presence: true

end