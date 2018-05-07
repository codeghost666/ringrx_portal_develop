class PbxParkingLotController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        groups = PbxParkingLot.load_by_user(@current_user)
        unless groups.kind_of? Array
            groups
        else
            render json: groups.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_group = PbxParkingLot.load_from_json(params[:pbx_parking_lot].to_json)
        if update_group.valid?
            response = update_group.save(@current_user) 
            if response.code != 200
                response
            else
                update_group = PbxParkingLot.load_from_json(response.body)
            end
        end
        render json: update_group.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_group = PbxParkingLot.load_from_json(params[:pbx_parking_lot].to_json)
        if create_group.valid?
            response = create_group.save(@current_user)
            if response.code != 200
                response
            else
                create_group = PbxGroup.load_from_json(response.body)
            end
        end
        render json: create_group.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete
        PbxParkingLot.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end    

    def extensions
        render json: PbxParkingLot.get_extensions(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def moh
        render json: PbxParkingLot.get_moh(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

end