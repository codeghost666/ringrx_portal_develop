class PbxLocationController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        locs = PbxLocation.load_by_user(@current_user)
        unless locs.first.kind_of? PbxLocation
            locs
        else
            render json: locs.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_loc = PbxLocation.load_from_json(params[:pbx_location].to_json)
        if update_loc.valid?
            response = update_loc.save(@current_user) 
            if response.code != 200
                response
            end
        end
        render json: update_loc.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_loc = PbxLocation.load_from_json(params[:pbx_location].to_json)
        if create_loc.valid?
            response = create_loc.save(@current_user)
            if response.code != 200
                response
            end
        end
        render json: create_loc.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxLocation.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
        
end