class PbxOnCallShift < RestModel
    include ActiveModel::Validations

    embeds_many :pbx_oncall_shift_users, class_name: :pbx_on_call_shift_user

    property :day_fri
    property :day_mon
    property :day_sat
    property :day_sun
    property :day_thu
    property :day_tue
    property :day_wed
    property :end_at
    property :end_time
    property :id
    property :metric
    property :name
    property :pbx_oncall_id #Display Only
    property :priority
    property :start_time
    property :start_at

    validates :name, presence: true

    def self.load_from_json(json)
        PbxOnCallShift.from_source(JSON.parse(json)).first
    end

end