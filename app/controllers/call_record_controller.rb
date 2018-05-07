class CallRecordController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        if params[:startDate] && params[:endDate]
            #start_date = Time.strptime(params[:startDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%m-%d-%Y %H:%M:%S%z")
            #end_date = Time.strptime(params[:endDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%m-%d-%Y %H:%M:%S%z")
            start_date = Time.strptime(params[:startDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%d-%m-%Y %H:%M:%S%z")
            end_date = Time.strptime(params[:endDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%d-%m-%Y %H:%M:%S%z")
        else
            start_date = (Time.now.utc - (10 * 60 * 60 * 24))
            end_date = Time.now.utc
        end
        #cdrs = CallRecord.load_by_user(@current_user, start_date.strftime("%m-%d-%Y"), end_date.strftime("%m-%d-%Y"))
        cdrs = CallRecord.load_by_user(@current_user, start_date.strftime("%m-%d-%Y"), end_date.strftime("%m-%d-%Y"))
        render json: cdrs.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_by_domain
        if params[:startDate] && params[:endDate]
            start_date = Time.strptime(params[:startDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%d-%m-%Y %H:%M:%S%z")
            end_date = Time.strptime(params[:endDate] + " " + Time.now.utc.strftime("%H:%M:%S%z"), "%d-%m-%Y %H:%M:%S%z")
        else
            start_date = (Time.now.utc - (10 * 60 * 60 * 24))
            end_date = Time.now.utc
        end
        cdrs = CallRecord.load_by_domain(@current_user, start_date.strftime("%m-%d-%Y"), end_date.strftime("%m-%d-%Y"))
        render json: cdrs.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end
