class PbxAuditLogController < ApplicationController
    before_action :authenticate_request!

    def get
        logs = PbxAuditLog.load_by_user(@current_user)
        render json: logs.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end