class PbxGroupController < ApplicationController
    before_action :authenticate_request!

    def get_by_user
        groups = PbxGroup.load_by_user(@current_user)
        unless groups.kind_of? Array
            groups
        else
            render json: groups.to_json
        end        
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def update
        update_group = PbxGroup.load_from_json(params[:pbx_group].to_json)
        if update_group.valid?
            response = update_group.save(@current_user) 
            if response.code != 200
                response
            else
                update_group = PbxGroup.load_from_json(response.body)
            end
        end
        render json: update_group.to_json
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def create
        create_group = PbxGroup.load_from_json(params[:pbx_group].to_json)
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

    def delete_group
        PbxGroup.delete(@current_user, params[:id])
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def delete_group_user
        response = PbxGroup.delete_group_user(@current_user, params[:group_id], params[:user_id])
        if response.code == 200
            render json: response.to_json, status: 204
        else
            response
        end
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def ringtones
        render json: PbxGroup.ringtones(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def mailboxes
        render json: PbxGroup.mailboxes(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end

    def pbx_users
        render json: PbxGroup.pbx_users(@current_user)
        rescue => e
            Rails.logger.error { "#{e.message} #{e.backtrace.join("\n")}" }
    end
end