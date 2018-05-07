class PbxUserSchedule < RestModel
    include ActiveModel::Validations

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
    property :pbx_user_id #Display Only
    property :priority
    property :start_time
    property :start_at
    property :oncall_behavior
    property :forward_behavior

    validates :name, presence: true

    def self.load_from_json(json)
        PbxUserSchedule.from_source(JSON.parse(json)).first
    end

end
