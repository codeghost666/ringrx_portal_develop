class PbxPhoneNumberController  < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        numbers = PbxPhoneNumber.load_by_user(@current_user)
        render json: numbers.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        phone_number = PbxPhoneNumber.load_from_json(params[:pbx_phone_number].to_json)
        response = phone_number.save(@current_user) unless phone_number.nil?
        if response.code != 200
            render json: response.to_json, status: response.code
        end
        render json: phone_number.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_distinctive_ring
        render json: PbxPhoneNumber.get_distinctive_ring(@current_user).to_json 
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_extensions
        render json: PbxPhoneNumber.get_extensions(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }        
    end

    def get_locations
        render json: PbxPhoneNumber.get_locations(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def get_rule_actions
        render json: PbxPhoneNumber.get_rule_actions(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

end