class PbxMyPhoneController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        user = PbxMyPhone.load_by_user(@current_user)
        render json: user.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_user = PbxMyPhone.load_from_json(params[:pbx_my_phone].to_json)
        if update_user.valid?
            response = update_user.save(@current_user) unless update_user.nil?
            if response.code != 200
                response
            else
                render json: PbxMyPhone.load_from_json(response.body).to_json
            end
        else
            render json: update_user.errors.to_json, status: 400
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_forward_behaviors
        render json: PbxMyPhone.get_forward_behaviors(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_oncall_behaviors
        render json: PbxMyPhone.get_oncall_behaviors(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update_password
        unless params[:current_password]
            render "current_password is required", status: 400
        end
        unless params[:new_password]
            render "new_password is required", status: 400
        end
        render "We need to implement this on the backend", status: 204
    end

    def schedule_create
        user = PbxMyPhone.load_by_user(@current_user)
        schedule = PbxUserSchedule.load_from_json(params[:pbx_user_schedule].to_json)
        user.pbx_user_schedules.push(schedule)
        if schedule.valid?
            response = user.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        render json: user.pbx_user_schedules.find_all { |obj| obj.priority == schedule.priority.to_s}.first
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def schedule_update
        user = PbxMyPhone.load_by_user(@current_user)
        schedule = PbxUserSchedule.load_from_json(params[:pbx_user_schedule].to_json)
        user.pbx_user_schedules.delete_if { |obj| obj.id.to_s == schedule.id.to_s }
        user.pbx_user_schedules.push(schedule)
        if schedule.valid?
            response = user.save(@current_user)
            if response.code != 200
                render json: response.to_json, status: response.code
            end
        end
        render json: user.pbx_user_schedules.find_all { |obj| obj.priority == schedule.priority.to_s}.first
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def schedule_delete
        response = PbxMyPhone.delete_schedule(@current_user, params[:pbx_user_schedule_id])
        if response.code == 200
            render json: response.to_json, status: 204
        else
            render json: response.to_json, status: response.code
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

end
